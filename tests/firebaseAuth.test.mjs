import test from 'node:test';
import assert from 'node:assert/strict';
import { createFirebaseUserGuard } from '../server/firebaseAuth.js';

function request(authorization) {
  return { get: (name) => name === 'authorization' ? authorization : undefined };
}

function response() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test('valid Firebase token attaches the user and continues', async () => {
  const req = request('Bearer valid-token');
  const res = response();
  let continued = false;
  const guard = createFirebaseUserGuard({ isConfigured: () => true, verifyIdToken: async () => ({ uid: 'user-a' }) });
  await guard(req, res, () => { continued = true; });
  assert.equal(continued, true);
  assert.equal(req.firebaseUser.uid, 'user-a');
});

for (const [name, header] of [['missing', undefined], ['malformed', 'Token abc'], ['empty bearer', 'Bearer ']]) {
  test(`${name} authorization is rejected without token verification`, async () => {
    let verified = false;
    const res = response();
    const guard = createFirebaseUserGuard({ isConfigured: () => true, verifyIdToken: async () => { verified = true; } });
    await guard(request(header), res, () => {});
    assert.equal(res.statusCode, 401);
    assert.equal(verified, false);
  });
}

test('invalid or expired token is rejected without continuing', async () => {
  const res = response();
  let continued = false;
  const guard = createFirebaseUserGuard({ isConfigured: () => true, verifyIdToken: async () => { throw new Error('expired'); } });
  await guard(request('Bearer expired-token'), res, () => { continued = true; });
  assert.equal(res.statusCode, 401);
  assert.equal(continued, false);
});
