package com.liftlog.app

import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.os.Build
import android.widget.Toast
import org.json.JSONObject
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.compose.setContent
import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.Image
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.input.pointer.pointerInput
import coil.compose.AsyncImage
import coil.ImageLoader
import coil.decode.GifDecoder
import coil.decode.ImageDecoderDecoder
import coil.request.ImageRequest
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import com.google.firebase.firestore.SetOptions
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.coroutines.tasks.await
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.util.UUID
import java.util.concurrent.TimeUnit
import java.net.URLEncoder
import java.time.LocalDate
import java.time.YearMonth
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody

private val Lime = Color(0xFF9DFF1A)
private val Dark = Color(0xFF101112)

@Serializable data class CatalogFile(val formatVersion: Int = 1, val presets: List<ExercisePreset> = emptyList())
@Serializable data class ExerciseContentFile(val formatVersion: Int = 1, val exercises: List<ExerciseContent> = emptyList())
@Serializable data class ExerciseContent(
    val presetId: String = "", val titleKo: String = "", val primaryMuscles: List<String> = emptyList(),
    val secondaryMuscles: List<String> = emptyList(), val equipment: String = "", val setup: String = "",
    val steps: List<String> = emptyList(), val keyCue: String = "", val cautions: List<String> = emptyList(),
    val referenceNotice: String? = null, val source: String = ""
)
@Serializable data class ExercisePreset(
    val presetId: String = "", val nameKo: String = "", val nameEn: String = "",
    val defaultUiPart: String = "", val searchAliases: List<String> = emptyList(),
    val canonicalPresetId: String = "", val storageExerciseId: String = "", val familyId: String = "",
    val canonicalVariantKey: String = "", val visualVariantKey: String? = null, val equipmentVariantId: String = "",
    val recordType: String = "weight_reps", val laterality: String = "bilateral", val implementMultiplier: Int = 1,
    val defaultLoadState: String = "external_load", val allowedLoadStates: List<String> = emptyList()
)
data class SetEntry(
    val id: String = UUID.randomUUID().toString(), val loadState: String = "external_load",
    val inputLoadValue: String = "", val inputLoadUnit: String = "kg", val reps: String = "", val durationSeconds: String = "", val completed: Boolean = true
)
data class WorkoutEntry(
    val id: String = UUID.randomUUID().toString(), val preset: ExercisePreset,
    val sets: List<SetEntry> = listOf(SetEntry(loadState = preset.defaultLoadState))
)
data class WorkoutRecord(
    val id: String = UUID.randomUUID().toString(), val date: String,
    val exercises: List<WorkoutEntry>, val title: String = ""
)

class MainActivity : ComponentActivity() {
    private val auth by lazy { FirebaseAuth.getInstance() }
    private var pendingExport: String? = null
    private val exportDocument = registerForActivityResult(ActivityResultContracts.CreateDocument("application/json")) { uri: Uri? ->
        val payload = pendingExport ?: return@registerForActivityResult
        if (uri != null) contentResolver.openOutputStream(uri)?.bufferedWriter()?.use { it.write(payload) }
        pendingExport = null
    }
    private val googleLogin = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode != RESULT_OK) {
            Toast.makeText(this, "Google 계정 선택이 취소되었거나 OAuth 설정이 일치하지 않습니다. (결과 코드: ${result.resultCode})", Toast.LENGTH_LONG).show()
            return@registerForActivityResult
        }
        try {
            val account = GoogleSignIn.getSignedInAccountFromIntent(result.data).getResult(ApiException::class.java)
            val credential = GoogleAuthProvider.getCredential(account.idToken, null)
            auth.signInWithCredential(credential).addOnFailureListener { error ->
                Toast.makeText(this, "Firebase 로그인 실패: ${error.message ?: error.javaClass.simpleName}", Toast.LENGTH_LONG).show()
            }
        } catch (error: Exception) {
            Toast.makeText(this, "Google 로그인 실패: ${error.message ?: error.javaClass.simpleName}", Toast.LENGTH_LONG).show()
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { LiftLogApp(onGoogleLogin = ::startGoogleLogin, onExport = ::saveExport) }
    }
    private fun startGoogleLogin() {
        val options = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id)).requestEmail().build()
        googleLogin.launch(GoogleSignIn.getClient(this, options).signInIntent)
    }
    private fun saveExport(payload: String) {
        pendingExport = payload
        exportDocument.launch("liftlog-workouts-${today()}.json")
    }
}

@Composable
private fun LiftLogApp(onGoogleLogin: () -> Unit, onExport: (String) -> Unit) {
    val catalog = loadCatalog()
    val exerciseContents = loadExerciseContents()
    val appContext = LocalContext.current
    val appPrefs = remember { appContext.getSharedPreferences("liftlog", Context.MODE_PRIVATE) }
    var selectedTab by rememberSaveable { mutableIntStateOf(0) }
    var startNewWorkout by rememberSaveable { mutableStateOf(false) }
    var darkMode by rememberSaveable { mutableStateOf(appPrefs.getBoolean("darkMode", true)) }
    var records by remember { mutableStateOf(emptyList<WorkoutRecord>()) }
    var user by remember { mutableStateOf(FirebaseAuth.getInstance().currentUser) }
    DisposableEffect(Unit) {
        val listener = FirebaseAuth.AuthStateListener { user = it.currentUser }
        FirebaseAuth.getInstance().addAuthStateListener(listener)
        onDispose { FirebaseAuth.getInstance().removeAuthStateListener(listener) }
    }
    DisposableEffect(user?.uid) {
        val currentUser = user
        if (currentUser == null) {
            records = emptyList()
            onDispose { }
        } else {
            val registration = FirebaseFirestore.getInstance().collection("users").document(currentUser.uid)
                .collection("workouts").orderBy("startedAt", Query.Direction.DESCENDING)
                .addSnapshotListener { snapshot, _ -> records = snapshot?.documents?.mapNotNull(::recordFromMap) ?: emptyList() }
            onDispose { registration.remove() }
        }
    }
    val scheme = if (darkMode) darkColorScheme(background = Dark, surface = Color(0xFF242526), primary = Lime)
        else lightColorScheme(primary = Color(0xFF5E9F00))
    MaterialTheme(colorScheme = scheme) {
        // Child screens (exercise detail and record editor) register their own handler first.
        // From a tab's root, the system back button returns to Home instead of closing the app.
        BackHandler(enabled = selectedTab != 0) { selectedTab = 0 }
        Scaffold(
            bottomBar = {
                NavigationBar {
                    listOf("홈", "운동 설명", "운동 기록", "AI 분석", "환경설정").forEachIndexed { index, label ->
                        NavigationBarItem(selected = selectedTab == index, onClick = { selectedTab = index },
                            icon = { Text((index + 1).toString()) }, label = { Text(label) })
                    }
                }
            }
        ) { padding ->
            Box(Modifier.fillMaxSize().padding(padding)) {
                when (selectedTab) {
                    0 -> HomeScreen(records, onStart = { startNewWorkout = true; selectedTab = 2 }, onHistory = { selectedTab = 2 })
                    1 -> ExerciseGuide(catalog, exerciseContents)
                    2 -> WorkoutScreen(catalog, records, startNew = startNewWorkout, onStartConsumed = { startNewWorkout = false }, onSave = { record ->
                        if (user != null) saveWorkout(record)
                    }, onDelete = { id ->
                        records = records.filterNot { it.id == id }; deleteWorkout(id)
                    }, onExport = { onExport(exportPayload(records)) })
                    3 -> AnalysisScreen(records)
                    else -> SettingsScreen(darkMode, { enabled ->
                        darkMode = enabled; appPrefs.edit().putBoolean("darkMode", enabled).apply()
                        user?.let { FirebaseFirestore.getInstance().collection("users").document(it.uid).set(mapOf("theme" to if (enabled) "dark" else "light"), SetOptions.merge()) }
                    }, user, onGoogleLogin)
                }
            }
        }
    }
}

@Composable private fun HomeScreen(records: List<WorkoutRecord>, onStart: () -> Unit, onHistory: () -> Unit) {
    val today = LocalDate.now()
    val month = YearMonth.from(today)
    val monthRecords = records.filter { runCatching { YearMonth.from(LocalDate.parse(it.date)) }.getOrNull() == month }
    val activeDates = monthRecords.mapNotNull { runCatching { LocalDate.parse(it.date) }.getOrNull() }.toSet()
    val monday = today.minusDays((today.dayOfWeek.value - 1).toLong())
    val weeklyCounts = (3 downTo 0).map { offset ->
        val start = monday.minusWeeks(offset.toLong())
        records.count { record -> runCatching { LocalDate.parse(record.date) }.getOrNull()?.let { !it.isBefore(start) && !it.isAfter(start.plusDays(6)) } == true }
    }
    val calendarCells = List(month.atDay(1).dayOfWeek.value % 7) { null } + (1..month.lengthOfMonth()).toList()

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Column {
            Text("HOME", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
            Text("운동 흐름을 한눈에 확인하세요.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        ElevatedCard(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp)) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("${month.year}년 ${month.monthValue}월", fontWeight = FontWeight.Black)
                    Text("${monthRecords.size} 세션 · ${activeDates.size}일", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(12.dp))
                Row(Modifier.fillMaxWidth()) { listOf("일", "월", "화", "수", "목", "금", "토").forEach { day -> Text(day, modifier = Modifier.weight(1f), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant) } }
                calendarCells.chunked(7).forEach { week ->
                    Row(Modifier.fillMaxWidth()) {
                        week.forEach { day ->
                            val date = day?.let { month.atDay(it) }
                            Box(Modifier.weight(1f).aspectRatio(1f).padding(2.dp).background(if (date in activeDates) Lime else Color.Transparent, RoundedCornerShape(12.dp)), contentAlignment = Alignment.Center) {
                                if (day != null) Text(day.toString(), color = if (date in activeDates) Dark else MaterialTheme.colorScheme.onSurface, fontWeight = if (date in activeDates) FontWeight.Black else FontWeight.Normal)
                            }
                        }
                    }
                }
            }
        }
        ElevatedCard(Modifier.fillMaxWidth()) {
            Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("최근 4주 운동 빈도", fontWeight = FontWeight.Black)
                weeklyCounts.forEachIndexed { index, count ->
                    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(if (index == 3) "이번 주" else "${3 - index}주 전", modifier = Modifier.width(46.dp), style = MaterialTheme.typography.labelMedium)
                        LinearProgressIndicator(progress = (count.coerceAtMost(7) / 7f), modifier = Modifier.weight(1f), color = Lime, trackColor = MaterialTheme.colorScheme.surfaceVariant)
                        Text("${count}회", modifier = Modifier.width(28.dp), style = MaterialTheme.typography.labelMedium)
                    }
                }
            }
        }
        ElevatedCard(Modifier.fillMaxWidth()) {
            Row(Modifier.padding(18.dp).fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column { Text("이번 달", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant); Text("운동일 ${activeDates.size}일", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Black) }
                Column(horizontalAlignment = Alignment.End) { Text("총 세션 ${monthRecords.size}회", fontWeight = FontWeight.Bold); Text("운동 종목 ${monthRecords.sumOf { it.exercises.size }}개", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant) }
            }
        }
        Button(onClick = onStart, modifier = Modifier.fillMaxWidth()) { Icon(Icons.Default.Add, null); Spacer(Modifier.width(6.dp)); Text("운동 기록") }
        OutlinedButton(onClick = onHistory, modifier = Modifier.fillMaxWidth()) { Text("전체 운동 기록 보기") }
    }
}

@Composable private fun ExerciseGuide(catalog: List<ExercisePreset>, contents: Map<String, ExerciseContent>) {
    var selectedGroup by rememberSaveable { mutableStateOf<String?>(null) }
    var selectedPresetId by rememberSaveable { mutableStateOf<String?>(null) }
    var highlightedGroup by rememberSaveable { mutableStateOf("가슴") }
    var requestedGroup by remember { mutableStateOf<String?>(null) }
    LaunchedEffect(requestedGroup) {
        requestedGroup?.let { group ->
            // Let the new highlight render briefly before opening the next page.
            delay(180)
            selectedGroup = group
            requestedGroup = null
        }
    }
    val selectedPreset = selectedPresetId?.let { id -> catalog.firstOrNull { it.presetId == id } }
    if (selectedPreset != null) {
        BackHandler { selectedPresetId = null }
        ExerciseDetail(selectedPreset, contents[selectedPreset.presetId], onBack = { selectedPresetId = null })
        return
    }
    val group = selectedGroup
    if (group != null) {
        BackHandler { selectedGroup = null }
        ExerciseGroupList(
            group = group,
            catalog = catalog,
            contents = contents,
            onBack = { selectedGroup = null },
            onPresetSelected = { selectedPresetId = it }
        )
        return
    }
    Column(Modifier.fillMaxSize().padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("EXERCISE GUIDE", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
        Text("신체 부위 또는 텍스트를 누르면 해당 부위 운동 목록으로 이동합니다.")
        BodySelector(selected = highlightedGroup) { group ->
            highlightedGroup = group
            requestedGroup = group
        }
    }
}

@Composable private fun ExerciseGroupList(
    group: String,
    catalog: List<ExercisePreset>,
    contents: Map<String, ExerciseContent>,
    onBack: () -> Unit,
    onPresetSelected: (String) -> Unit
) {
    Column(Modifier.fillMaxSize().padding(horizontal = 20.dp)) {
        Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            TextButton(onClick = onBack, contentPadding = PaddingValues(0.dp)) { Text("← 운동 설명") }
            Spacer(Modifier.width(12.dp))
            Text("$group 운동", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Black)
        }
        Text("운동을 누르면 수행 방법과 동작 GIF를 확인할 수 있습니다.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        LazyColumn(contentPadding = PaddingValues(vertical = 12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            items(catalog.filter { koreanPart(it.defaultUiPart) == group }, key = { it.presetId }) { preset ->
                ElevatedCard(Modifier.fillMaxWidth().clickable { onPresetSelected(preset.presetId) }) {
                    ListItem(
                        headlineContent = { Text(if (preset.nameKo.isBlank()) preset.nameEn else preset.nameKo) },
                        supportingContent = { Text(contents[preset.presetId]?.keyCue ?: group) }
                    )
                }
            }
        }
    }
}

@Composable private fun ExerciseDetail(preset: ExercisePreset, content: ExerciseContent?, onBack: () -> Unit) {
    val name = preset.nameKo.ifBlank { preset.nameEn }
    val detail = content ?: ExerciseContent(presetId = preset.presetId, titleKo = name, equipment = "운동 장비")
    val context = LocalContext.current
    // Register an animated decoder explicitly. Without this, some Coil 2 image-loader
    // configurations render only the first GIF frame even though the network response is valid.
    val gifImageLoader = remember(context) {
        ImageLoader.Builder(context).components {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) add(ImageDecoderDecoder.Factory())
            else add(GifDecoder.Factory())
        }.build()
    }
    val scope = rememberCoroutineScope()
    var mediaUrl by remember(preset.presetId) { mutableStateOf<String?>(null) }
    var mediaMatchedName by remember(preset.presetId) { mutableStateOf<String?>(null) }
    var mediaMatchedExactly by remember(preset.presetId) { mutableStateOf(true) }
    var mediaAuthToken by remember(preset.presetId) { mutableStateOf<String?>(null) }
    var mediaError by remember(preset.presetId) { mutableStateOf<String?>(null) }
    var mediaLoading by remember(preset.presetId) { mutableStateOf(false) }
    LazyColumn(Modifier.fillMaxSize().padding(horizontal = 20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            Spacer(Modifier.height(12.dp))
            TextButton(onClick = onBack, contentPadding = PaddingValues(0.dp)) { Text("← 운동 목록") }
            Text(name, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
            Text(preset.nameEn, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        item {
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("자극 부위", fontWeight = FontWeight.Black)
                    Text("주요: ${detail.primaryMuscles.filter { it.isNotBlank() }.joinToString(" · ").ifBlank { koreanPart(preset.defaultUiPart) }}")
                    if (detail.secondaryMuscles.isNotEmpty()) Text("보조: ${detail.secondaryMuscles.joinToString(" · ")}", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("장비: ${detail.equipment}", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                    MuscleActivationMap(
                        primaryMuscles = detail.primaryMuscles,
                        secondaryMuscles = detail.secondaryMuscles,
                        fallbackGroup = koreanPart(preset.defaultUiPart)
                    )
                }
            }
        }
        item {
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("동작 GIF", fontWeight = FontWeight.Black)
                    Text("필요할 때만 불러오며, 앱에 API 키를 저장하지 않습니다.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    if (mediaUrl == null) {
                        Button(onClick = {
                            mediaLoading = true; mediaError = null
                            scope.launch {
                                runCatching { requestExerciseMedia(preset) }.onSuccess { media ->
                                    mediaUrl = media.url; mediaMatchedName = media.name; mediaMatchedExactly = media.matchedExactly; mediaAuthToken = media.authToken
                                }.onFailure { error -> mediaError = error.message ?: "GIF를 불러오지 못했습니다." }
                                mediaLoading = false
                            }
                        }, enabled = !mediaLoading, modifier = Modifier.fillMaxWidth()) { Text(if (mediaLoading) "GIF 불러오는 중…" else "동작 GIF 보기") }
                    } else {
                        val request = ImageRequest.Builder(context).data(mediaUrl).crossfade(true)
                            .addHeader("Authorization", "Bearer ${mediaAuthToken.orEmpty()}").build()
                        AsyncImage(model = request, imageLoader = gifImageLoader, contentDescription = "$name 동작 GIF", contentScale = ContentScale.Fit, modifier = Modifier.fillMaxWidth().heightIn(max = 320.dp))
                        mediaMatchedName?.let { matched -> Text("WorkoutX 매칭: $matched", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant) }
                        if (!mediaMatchedExactly) Text("이름 기준 유사 동작일 수 있으니 장비·그립·각도를 확인하세요.", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.error)
                    }
                    mediaError?.let { Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall) }
                }
            }
        }
        item {
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("준비", fontWeight = FontWeight.Black)
                    Text(detail.setup)
                    Text("수행 방법", fontWeight = FontWeight.Black)
                    detail.steps.forEachIndexed { index, step -> Text("${index + 1}. $step") }
                }
            }
        }
        item {
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("핵심 큐", fontWeight = FontWeight.Black)
                    Text(detail.keyCue, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                }
            }
        }
        item {
            ElevatedCard(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("주의사항", fontWeight = FontWeight.Black)
                    detail.cautions.forEach { caution -> Text("• $caution") }
                }
            }
        }
        if (detail.referenceNotice != null) item {
            Card(Modifier.fillMaxWidth(), colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer)) {
                Column(Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("참고 동작 안내", fontWeight = FontWeight.Black)
                    Text(detail.referenceNotice)
                }
            }
        }
        item { Text("콘텐츠: ${detail.source}", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant); Spacer(Modifier.height(24.dp)) }
    }
}

@Composable private fun BodySelector(selected: String, select: (String) -> Unit) {
    val groups = listOf("가슴", "등", "하체", "어깨", "팔", "복부")
    val context = LocalContext.current
    val selectedAsset = when (selected) {
        "등" -> "body-map-selected-back.png"
        "어깨" -> "body-map-selected-shoulders.png"
        "팔" -> "body-map-selected-arms.png"
        "복부" -> "body-map-selected-abs.png"
        "하체" -> "body-map-selected-legs.png"
        else -> "body-map-selected-chest.png"
    }
    // Selection is baked into each artwork state so a colored overlay can never
    // spill over the body silhouette or fight the illustration's anatomy lines.
    val bodyMap = remember(selectedAsset) { BitmapFactory.decodeStream(context.assets.open(selectedAsset)).asImageBitmap() }
    Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("신체 부위를 직접 누르거나 아래 버튼을 선택하세요.")
        Box(Modifier.fillMaxWidth().aspectRatio(bodyMap.width.toFloat() / bodyMap.height).padding(vertical = 8.dp)) {
            Image(bodyMap, contentDescription = "운동 부위 선택 신체 지도", contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize().pointerInput(selected) {
                detectTapGestures { point -> select(bodyPartAt(point.x / size.width, point.y / size.height)) }
            })
        }
        Text("선택: $selected", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
        groups.chunked(3).forEach { row ->
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { item -> FilterChip(selected = selected == item, onClick = { select(item) }, label = { Text(item) }, modifier = Modifier.weight(1f)) }
            }
            Spacer(Modifier.height(8.dp))
        }
    }
}
private fun bodyPartAt(x: Float, y: Float): String {
    // The artwork has two full figures with a narrow gap at the middle.
    if (x in .46f.. .54f || y < .11f || y > .93f) return "가슴"
    val front = x < 0.5f
    val localX = if (front) x / 0.5f else (x - 0.5f) / 0.5f
    if (localX < .13f || localX > .87f) return if (y < .28f) "어깨" else "팔"
    return when {
        y < .23f -> "어깨"
        front && y < .30f -> "가슴"
        !front && y < .47f -> "등"
        front && y < .48f -> "복부"
        else -> "하체"
    }
}

@Composable private fun WorkoutScreen(catalog: List<ExercisePreset>, records: List<WorkoutRecord>, startNew: Boolean, onStartConsumed: () -> Unit, onSave: (WorkoutRecord) -> Unit, onDelete: (String) -> Unit, onExport: () -> Unit) {
    var editing by remember { mutableStateOf<WorkoutRecord?>(null) }
    LaunchedEffect(startNew) {
        if (startNew) {
            editing = WorkoutRecord(date = today(), exercises = emptyList())
            onStartConsumed()
        }
    }
    BackHandler(enabled = editing != null) { editing = null }
    AnimatedContent(
        // Keep the outgoing record as AnimatedContent's target state.  The previous
        // implementation looked up `editing!!` again while the exit animation ran;
        // pressing Back had already set it to null and crashed the app.
        targetState = editing,
        transitionSpec = {
            (fadeIn() + slideInHorizontally { it / 5 }) togetherWith
                (fadeOut() + slideOutHorizontally { -it / 5 })
        },
        label = "workoutRecordTransition"
    ) { recordToEdit ->
        if (recordToEdit != null) WorkoutEditor(catalog, recordToEdit, { onSave(it); editing = null }, { editing = null })
        else WorkoutHistory(catalog, records, { editing = it }, { onDelete(it) }, onExport)
    }
}

@Composable private fun MuscleActivationMap(
    primaryMuscles: List<String>,
    secondaryMuscles: List<String>,
    fallbackGroup: String
) {
    val context = LocalContext.current
    val primary = muscleRegionsFor(primaryMuscles, fallbackGroup)
    val secondary = muscleRegionsFor(secondaryMuscles, "") - primary
    val selectedAsset = activationMapAsset(primary)
    // This uses a prepared anatomical state image instead of painting a generic
    // polygon over the body. Therefore the lime activation always stops exactly
    // on the illustration's own muscle boundaries.
    val muscleMap = remember(selectedAsset) { BitmapFactory.decodeStream(context.assets.open(selectedAsset)).asImageBitmap() }
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text("자극 지도 · 전면 / 후면", fontWeight = FontWeight.Bold)
        Box(Modifier.fillMaxWidth().heightIn(max = 360.dp).aspectRatio(muscleMap.width.toFloat() / muscleMap.height), contentAlignment = Alignment.Center) {
            Image(muscleMap, contentDescription = "자극 부위 지도", contentScale = ContentScale.Fit, modifier = Modifier.fillMaxSize())
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("● 형광: 주요 자극군", color = Lime, style = MaterialTheme.typography.labelSmall)
            if (secondary.isNotEmpty()) Text("보조 자극은 위 설명 참고", color = MaterialTheme.colorScheme.onSurfaceVariant, style = MaterialTheme.typography.labelSmall)
        }
    }
}

private fun activationMapAsset(primary: Set<String>): String = when {
    "chest" in primary -> "body-map-selected-chest.png"
    "back" in primary -> "body-map-selected-back.png"
    "shoulder" in primary -> "body-map-selected-shoulders.png"
    "arms" in primary -> "body-map-selected-arms.png"
    "abs" in primary -> "body-map-selected-abs.png"
    "thighs" in primary || "calves" in primary -> "body-map-selected-legs.png"
    else -> "body-map-selected-chest.png"
}

private fun muscleRegionsFor(muscles: List<String>, fallbackGroup: String): Set<String> {
    val text = (muscles + fallbackGroup).joinToString(" ")
    return buildSet {
        if (text.contains("가슴")) add("chest")
        if (text.contains("어깨") || text.contains("삼각근")) add("shoulder")
        if (text.contains("이두") || text.contains("삼두") || text.contains("전완") || text.contains("팔")) add("arms")
        if (text.contains("복부") || text.contains("복직") || text.contains("코어") || text.contains("외복")) add("abs")
        if (text.contains("대퇴") || text.contains("햄스트링") || text.contains("사두") || text.contains("둔근") || text.contains("하체")) add("thighs")
        if (text.contains("종아리")) add("calves")
        if (text.contains("등") || text.contains("광배") || text.contains("승모")) add("back")
    }
}

@Composable private fun WorkoutHistory(catalog: List<ExercisePreset>, records: List<WorkoutRecord>, edit: (WorkoutRecord) -> Unit, remove: (String) -> Unit, export: () -> Unit) {
    var deleting by remember { mutableStateOf<WorkoutRecord?>(null) }
    if (deleting != null) AlertDialog(onDismissRequest = { deleting = null }, title = { Text("운동 기록 삭제") },
        text = { Text("이 운동기록을 삭제하시겠습니까?") }, confirmButton = { TextButton(onClick = { remove(deleting!!.id); deleting = null }) { Text("삭제") } },
        dismissButton = { TextButton(onClick = { deleting = null }) { Text("취소") } })
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Column(Modifier.fillMaxWidth()) {
            Text("WORKOUT LOG", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End, verticalAlignment = Alignment.CenterVertically) {
                TextButton(onClick = export, enabled = records.isNotEmpty()) { Text("내보내기") }
                Spacer(Modifier.width(8.dp))
                FilledTonalButton(onClick = { edit(WorkoutRecord(date = today(), exercises = emptyList())) }, modifier = Modifier.widthIn(min = 92.dp)) { Icon(Icons.Default.Add, null); Spacer(Modifier.width(4.dp)); Text("기록", softWrap = false) }
            }
        }
        LazyColumn(contentPadding = PaddingValues(vertical = 12.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(records) { record ->
                ElevatedCard(Modifier.fillMaxWidth().clickable { edit(record) }) { Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(record.date, fontWeight = FontWeight.Bold)
                        Text(record.title.ifBlank { "제목 없음" }, maxLines = 1, fontWeight = FontWeight.SemiBold)
                    }
                    IconButton(onClick = { edit(record) }) { Icon(Icons.Default.Edit, "수정") }
                    IconButton(onClick = { deleting = record }) { Icon(Icons.Default.Delete, "삭제") }
                }}
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable private fun WorkoutEditor(catalog: List<ExercisePreset>, initial: WorkoutRecord, save: (WorkoutRecord) -> Unit, cancel: () -> Unit) {
    var date by remember { mutableStateOf(initial.date) }
    var title by remember { mutableStateOf(initial.title) }
    var exercises by remember { mutableStateOf(initial.exercises) }
    var pickerOpen by remember { mutableStateOf(false) }
    Scaffold(topBar = {
        TopAppBar(
            title = { Text("운동 기록 수정") },
            navigationIcon = { TextButton(onClick = cancel) { Text("취소") } },
            actions = {
                TextButton(onClick = { save(initial.copy(date = date, exercises = exercises, title = title.trim())) }, enabled = exercises.isNotEmpty()) {
                    Text("SAVE", color = Lime, fontWeight = FontWeight.Bold)
                }
            }
        )
    }) { padding ->
        LazyColumn(Modifier.fillMaxSize().padding(padding).padding(horizontal = 16.dp), contentPadding = PaddingValues(bottom = 30.dp)) {
            item {
                OutlinedTextField(date, { date = it }, label = { Text("날짜 (YYYY-MM-DD)") }, modifier = Modifier.fillMaxWidth())
                Spacer(Modifier.height(10.dp))
                OutlinedTextField(title, { title = it }, label = { Text("기록 제목 (예: 등, 하체)") }, modifier = Modifier.fillMaxWidth(), singleLine = true)
            }
            items(exercises, key = { it.id }) { exercise ->
                ExerciseCard(exercise, { changed -> exercises = exercises.map { if (it.id == changed.id) changed else it } }, { exercises = exercises.filterNot { it.id == exercise.id } })
            }
            item { Button(onClick = { pickerOpen = true }, modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp)) { Icon(Icons.Default.Add, null); Spacer(Modifier.width(6.dp)); Text("운동 추가") } }
        }
    }
    if (pickerOpen) ExercisePickerSheet(catalog, onSelect = { preset -> exercises = exercises + WorkoutEntry(preset = preset); pickerOpen = false }, onDismiss = { pickerOpen = false })
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable private fun ExercisePickerSheet(catalog: List<ExercisePreset>, onSelect: (ExercisePreset) -> Unit, onDismiss: () -> Unit) {
    var query by rememberSaveable { mutableStateOf("") }
    val searchFocus = remember { FocusRequester() }
    LaunchedEffect(Unit) { searchFocus.requestFocus() }
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(Modifier.fillMaxWidth().fillMaxHeight(0.8f).imePadding().padding(horizontal = 20.dp, vertical = 8.dp)) {
            Text("운동 추가", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Black)
            Text("검색 후 운동을 선택하세요.", style = MaterialTheme.typography.bodySmall)
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(query, { query = it }, singleLine = true, label = { Text("운동 검색") }, modifier = Modifier.fillMaxWidth().focusRequester(searchFocus))
            Spacer(Modifier.height(8.dp))
            LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp), contentPadding = PaddingValues(bottom = 16.dp)) {
                items(catalog.filter { matches(it, query) }) { preset ->
                    ListItem(headlineContent = { Text(preset.nameKo) }, supportingContent = { Text(koreanPart(preset.defaultUiPart)) }, modifier = Modifier.fillMaxWidth().clickable { onSelect(preset) })
                    HorizontalDivider()
                }
            }
        }
    }
}

@Composable private fun ExerciseCard(exercise: WorkoutEntry, change: (WorkoutEntry) -> Unit, delete: () -> Unit) {
    ElevatedCard(Modifier.fillMaxWidth().padding(vertical = 8.dp)) { Column(Modifier.padding(14.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) { Text(exercise.preset.nameKo, color = Lime, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f)); IconButton(onClick = delete) { Icon(Icons.Default.Delete, "운동 삭제") } }
        exercise.sets.forEachIndexed { index, set ->
            Column(Modifier.fillMaxWidth()) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("SET ${index + 1}", style = MaterialTheme.typography.labelMedium, modifier = Modifier.weight(1f))
                    LoadStateSelector(set.loadState, exercise.preset.allowedLoadStates.ifEmpty { listOf(exercise.preset.defaultLoadState) }) { state -> change(exercise.copy(sets = exercise.sets.map { if (it.id == set.id) it.copy(loadState = state) else it })) }
                    Checkbox(checked = set.completed, onCheckedChange = { checked -> change(exercise.copy(sets = exercise.sets.map { if (it.id == set.id) it.copy(completed = checked) else it })) })
                    IconButton(onClick = { change(exercise.copy(sets = exercise.sets.filterNot { it.id == set.id })) }, enabled = exercise.sets.size > 1) { Icon(Icons.Default.Delete, "세트 삭제") }
                }
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    val recordType = exercise.preset.recordType
                    val needsLoad = recordType !in setOf("reps_only", "time")
                    val needsReps = recordType !in setOf("time", "weight_time")
                    val needsTime = recordType in setOf("time", "weight_time")
                    if (needsLoad) {
                        OutlinedTextField(set.inputLoadValue, { value -> change(exercise.copy(sets = exercise.sets.map { if (it.id == set.id) it.copy(inputLoadValue = value) else it })) }, label = { Text("중량") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal, imeAction = ImeAction.Next), modifier = Modifier.weight(1f))
                        Spacer(Modifier.width(6.dp)); UnitSelector(set.inputLoadUnit) { unit -> change(exercise.copy(sets = exercise.sets.map { if (it.id == set.id) it.copy(inputLoadUnit = unit) else it })) }; Spacer(Modifier.width(6.dp))
                    }
                    if (needsReps) OutlinedTextField(set.reps, { value -> change(exercise.copy(sets = exercise.sets.map { if (it.id == set.id) it.copy(reps = value) else it })) }, label = { Text("REPS") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number, imeAction = ImeAction.Next), modifier = Modifier.weight(1f))
                    if (needsTime) OutlinedTextField(set.durationSeconds, { value -> change(exercise.copy(sets = exercise.sets.map { if (it.id == set.id) it.copy(durationSeconds = value) else it })) }, label = { Text("초") }, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number, imeAction = ImeAction.Next), modifier = Modifier.weight(1f))
                }
            }
        }
        TextButton(
            onClick = {
                change(exercise.copy(sets = exercise.sets + SetEntry(loadState = exercise.preset.defaultLoadState)))
            },
            modifier = Modifier.fillMaxWidth()
        ) { Text("+ SET") }
    }}
}

@Composable private fun LoadStateSelector(value: String, allowed: List<String>, change: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Box {
        TextButton(onClick = { expanded = true }) { Text(loadStateLabel(value), maxLines = 1) }
        DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            allowed.forEach { state -> DropdownMenuItem(text = { Text(loadStateLabel(state)) }, onClick = { change(state); expanded = false }) }
        }
    }
}
private fun loadStateLabel(state: String) = when (state) {
    "bodyweight" -> "맨몸"; "external_load" -> "외부 중량"; "added_weight" -> "추가 중량"; "assisted" -> "보조 중량"; "band_assisted" -> "밴드 보조"; "band_resisted" -> "밴드 저항"; else -> state
}

@Composable private fun UnitSelector(value: String, change: (String) -> Unit) {
    var expanded by remember { mutableStateOf(false) }
    Box { OutlinedButton(onClick = { expanded = true }) { Text(value.uppercase()) }; DropdownMenu(expanded, { expanded = false }) { listOf("kg", "lb").forEach { DropdownMenuItem({ Text(it.uppercase()) }, { change(it); expanded = false }) } } }
}

@Composable private fun AnalysisScreen(records: List<WorkoutRecord>) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var result by remember { mutableStateOf("최근 기록 또는 누적 기록 분석을 선택하세요.") }
    var analyzing by remember { mutableStateOf(false) }
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Text("AI ANALYSIS", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
        Text("최근 세션 분석과 전체 누적 분석을 분리합니다.")
        Row(Modifier.padding(vertical = 16.dp), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Button(onClick = { scope.launch { analyzing = true; result = requestAnalysis(context, records, false); analyzing = false } }, enabled = records.isNotEmpty() && !analyzing) { Text("최근 기록 분석") }
            Button(onClick = { scope.launch { analyzing = true; result = requestAnalysis(context, records, true); analyzing = false } }, enabled = records.isNotEmpty() && !analyzing) { Text("누적 기록 분석") }
        }
        if (analyzing) LinearProgressIndicator(Modifier.fillMaxWidth())
        ElevatedCard(Modifier.fillMaxWidth().weight(1f)) {
            Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(18.dp)) { Text(result) }
        }
    }
}

@Composable private fun SettingsScreen(dark: Boolean, setDark: (Boolean) -> Unit, user: FirebaseUser?, login: () -> Unit) {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("liftlog", Context.MODE_PRIVATE) }
    var height by rememberSaveable { mutableStateOf(prefs.getString("heightCm", "") ?: "") }; var weight by rememberSaveable { mutableStateOf(prefs.getString("weightKg", "") ?: "") }
    LaunchedEffect(user?.uid) {
        if (user != null) FirebaseFirestore.getInstance().collection("users").document(user.uid).get().addOnSuccessListener { document ->
            document.getDouble("heightCm")?.let { height = it.toString().removeSuffix(".0"); prefs.edit().putString("heightCm", height).apply() }
            document.getDouble("weightKg")?.let { weight = it.toString().removeSuffix(".0"); prefs.edit().putString("weightKg", weight).apply() }
        }
    }
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Text("SETTINGS", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Black)
        if (user == null) Button(onClick = login, modifier = Modifier.fillMaxWidth()) { Text("Google로 로그인") }
        else {
            Text("로그인됨: ${user.displayName ?: user.email ?: "Google 사용자"}")
            TextButton(onClick = { FirebaseAuth.getInstance().signOut() }) { Text("로그아웃") }
        }
        Row(verticalAlignment = Alignment.CenterVertically) { Text("다크 모드", Modifier.weight(1f)); Switch(dark, setDark) }
        OutlinedTextField(height, { value ->
            height = value; prefs.edit().putString("heightCm", value).apply(); user?.let { FirebaseFirestore.getInstance().collection("users").document(it.uid).set(mapOf("heightCm" to value.toDoubleOrNull()), SetOptions.merge()) }
        }, label = { Text("키 (cm)") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(weight, { value ->
            weight = value; prefs.edit().putString("weightKg", value).apply(); user?.let { FirebaseFirestore.getInstance().collection("users").document(it.uid).set(mapOf("weightKg" to value.toDoubleOrNull()), SetOptions.merge()) }
        }, label = { Text("몸무게 (kg)") }, modifier = Modifier.fillMaxWidth())
        Text("키와 몸무게는 Gemini 분석 요청에 자동으로 포함됩니다.", style = MaterialTheme.typography.bodySmall)
    }
}

@Composable private fun loadCatalog(): List<ExercisePreset> {
    val context = androidx.compose.ui.platform.LocalContext.current
    // The shared catalog intentionally uses null for some optional variant fields.
    // Coerce those values to each model property's default instead of crashing at startup.
    return remember { Json { ignoreUnknownKeys = true; coerceInputValues = true }.decodeFromString<CatalogFile>(context.assets.open("friend_exercise_catalog_v1.json").bufferedReader().use { it.readText() }).presets }
}
@Composable private fun loadExerciseContents(): Map<String, ExerciseContent> {
    val context = androidx.compose.ui.platform.LocalContext.current
    return remember {
        Json { ignoreUnknownKeys = true }
            .decodeFromString<ExerciseContentFile>(context.assets.open("exercise_content_v1.json").bufferedReader().use { it.readText() })
            .exercises.associateBy { it.presetId }
    }
}
private fun koreanPart(part: String) = when (part) { "chest" -> "가슴"; "back" -> "등"; "lower_body", "legs" -> "하체"; "shoulders" -> "어깨"; "arms" -> "팔"; else -> "복부" }
private fun matches(p: ExercisePreset, query: String): Boolean { val normalized = query.replace(" ", "").lowercase(); return normalized.isBlank() || listOf(p.nameKo, p.nameEn, *p.searchAliases.toTypedArray()).any { it.replace(" ", "").lowercase().contains(normalized) || normalized.contains(it.replace(" ", "").lowercase()) } }
private fun today() = java.time.LocalDate.now().toString()
private fun kg(value: String, unit: String) = value.toDoubleOrNull()?.let { if (unit == "lb") it * 0.45359237 else it }
private fun recentAnalysis(record: WorkoutRecord) = "최근 ${record.date} 기록의 ${record.exercises.size}개 종목을 분석 대상으로 선택했습니다. Gemini 서버를 연결하면 웹 앱과 동일한 상세 결과를 표시합니다."
private fun cumulativeAnalysis(records: List<WorkoutRecord>) = "누적 ${records.size}개 기록(${records.last().date} ~ ${records.first().date})을 분석 대상으로 선택했습니다. 최신 1회가 아니라 모든 기록을 분석 요청에 포함합니다."
private val analysisClient = OkHttpClient.Builder()
    .connectTimeout(30, TimeUnit.SECONDS)
    .writeTimeout(30, TimeUnit.SECONDS)
    .readTimeout(180, TimeUnit.SECONDS)
    .callTimeout(190, TimeUnit.SECONDS)
    .build()
private data class ExerciseMedia(val url: String, val name: String, val matchedExactly: Boolean, val authToken: String)
private suspend fun requestExerciseMedia(preset: ExercisePreset): ExerciseMedia = withContext(Dispatchers.IO) {
    val token = FirebaseAuth.getInstance().currentUser?.getIdToken(false)?.await()?.token
        ?: error("GIF를 보려면 Google 로그인이 필요합니다.")
    val name = URLEncoder.encode(preset.nameEn, "UTF-8")
    val equipment = URLEncoder.encode(preset.equipmentVariantId, "UTF-8")
    val presetId = URLEncoder.encode(preset.presetId, "UTF-8")
    val request = Request.Builder().url("${BuildConfig.ANALYSIS_BASE_URL}/api/exercise-media?name=$name&equipment=$equipment&presetId=$presetId")
        .header("Authorization", "Bearer $token").build()
    analysisClient.newCall(request).execute().use { response ->
        val body = response.body?.string().orEmpty()
        if (!response.isSuccessful) error(JSONObject(body).optString("error", "GIF를 불러오지 못했습니다. (${response.code})"))
        val json = JSONObject(body)
        val gifPath = json.optString("gifPath")
        if (gifPath.isBlank()) error("GIF 주소가 없습니다.")
        ExerciseMedia("${BuildConfig.ANALYSIS_BASE_URL}$gifPath", json.optString("name", preset.nameEn), json.optBoolean("matchedExactly", false), token)
    }
}
private suspend fun requestAnalysis(context: Context, records: List<WorkoutRecord>, cumulative: Boolean): String = withContext(Dispatchers.IO) {
    try {
        val prefs = context.getSharedPreferences("liftlog", Context.MODE_PRIVATE)
        val idToken = FirebaseAuth.getInstance().currentUser?.getIdToken(false)?.await()?.token
            ?: return@withContext "AI 분석에는 Google 로그인이 필요합니다."
        val history = records.map(::analysisRecord)
        val profile = mapOf("heightCm" to prefs.getString("heightCm", ""), "weightKg" to prefs.getString("weightKg", ""))
        val workoutData: Map<String, Any?> = if (cumulative) mapOf(
            "profile" to profile,
            "cumulativeSummary" to mapOf("workoutCount" to history.size, "from" to records.last().date, "to" to records.first().date),
            "workoutHistory" to history
        ) else mapOf(
            "profile" to profile,
            "latestWorkout" to history.first(),
            "cumulativeSummary" to mapOf("workoutCount" to history.size, "from" to records.last().date, "to" to records.first().date),
            "workoutHistory" to history
        )
        val payload = JSONObject(mapOf("analysisMode" to if (cumulative) "cumulative" else "latest", "workoutData" to workoutData)).toString()
        val request = Request.Builder().url("${BuildConfig.ANALYSIS_BASE_URL}/api/analyze")
            .header("Authorization", "Bearer $idToken")
            .post(payload.toRequestBody("application/json; charset=utf-8".toMediaType())).build()
        analysisClient.newCall(request).execute().use { response ->
            val text = response.body?.string().orEmpty()
            if (!response.isSuccessful) return@withContext "분석 서버 오류 (${response.code}): ${JSONObject(text).optString("error", text)}"
            val json = JSONObject(text)
            listOf("총평" to json.optString("summary"), "잘한 점" to json.optString("good"), "개선할 점" to json.optString("bad"), "다음 운동 추천" to json.optString("nextFocus")).filter { it.second.isNotBlank() }.joinToString("\n\n") { "${it.first}\n${it.second}" }
        }
    } catch (error: Exception) { "AI 분석 연결 실패: ${error.message ?: error.javaClass.simpleName}" }
}
private fun analysisRecord(record: WorkoutRecord): Map<String, Any?> = mapOf(
    "sourceRecordId" to record.id,
    "status" to "completed",
    "startedAt" to record.date,
    "estimatedTrainingDurationMinutes" to maxOf(20, ((record.exercises.sumOf { it.sets.size } * 2.5 + record.exercises.size * 3) / 5).toInt() * 5),
    "exercises" to record.exercises.mapIndexed { index, exercise ->
        mapOf(
            "sourceExerciseInstanceId" to exercise.id,
            "orderIndex" to index,
            "presetId" to exercise.preset.presetId,
            "nameSnapshot" to exercise.preset.nameKo,
            "defaultUiPart" to exercise.preset.defaultUiPart,
            "sets" to exercise.sets.mapIndexed { setIndex, set ->
                mapOf("sourceSetId" to set.id, "setIndex" to setIndex, "loadState" to set.loadState,
                    "inputLoadValue" to set.inputLoadValue, "inputLoadUnit" to set.inputLoadUnit,
                    "weightKg" to kg(set.inputLoadValue, set.inputLoadUnit), "reps" to set.reps.toIntOrNull(),
                    "durationSeconds" to set.durationSeconds.toIntOrNull(), "completed" to set.completed)
            }
        )
    }
)
private fun exportPayload(records: List<WorkoutRecord>): String = JSONObject(mapOf(
    "format" to "yeonsik.workout-transfer", "formatVersion" to 2, "catalogContractVersion" to 1,
    "catalogSourceCommit" to "381e160771b8859ac68c51ec67c1e6ed6c08a26f", "sourceApp" to "liftlog",
    "exportedAt" to java.time.Instant.now().toString(), "workouts" to records.map(::exportWorkout)
)).toString(2)
private fun exportWorkout(record: WorkoutRecord): Map<String, Any?> = mapOf(
    "sourceRecordId" to record.id, "status" to "completed", "title" to record.title.ifBlank { null },
    "startedAt" to java.time.LocalDate.parse(record.date).atTime(12, 0).atZone(java.time.ZoneId.systemDefault()).toInstant().toString(),
    "endedAt" to null, "memo" to null,
    "exercises" to record.exercises.mapIndexed { exerciseIndex, exercise ->
        val preset = exercise.preset
        mapOf("sourceExerciseInstanceId" to exercise.id, "orderIndex" to exerciseIndex + 1,
            "storageExerciseId" to preset.storageExerciseId.ifBlank { preset.presetId }, "presetId" to preset.presetId,
            "canonicalPresetId" to preset.canonicalPresetId.ifBlank { preset.presetId }, "familyId" to preset.familyId.ifBlank { preset.presetId },
            "canonicalVariantKey" to preset.canonicalVariantKey.ifBlank { "{}" }, "visualVariantKey" to preset.visualVariantKey,
            "nameSnapshot" to preset.nameKo, "defaultUiPart" to normalizedPart(preset.defaultUiPart),
            "recordType" to preset.recordType, "laterality" to preset.laterality, "implementMultiplier" to preset.implementMultiplier, "memo" to null,
            "sets" to exercise.sets.mapIndexed { setIndex, set ->
                val values = mutableMapOf<String, Any?>("sourceSetId" to set.id, "setIndex" to setIndex + 1,
                    "loadState" to set.loadState, "inputLoadValue" to set.inputLoadValue.toDoubleOrNull(), "inputLoadUnit" to set.inputLoadUnit,
                    "reps" to set.reps.toIntOrNull(), "durationSeconds" to set.durationSeconds.toIntOrNull(), "completed" to set.completed,
                    "restSeconds" to null, "rir" to null, "rpe" to null, "memo" to null)
                values[when (set.loadState) { "added_weight" -> "addedWeightKg"; "assisted" -> "assistedWeightKg"; else -> "weightKg" }] = kg(set.inputLoadValue, set.inputLoadUnit)
                values
            }
        )
    }
)
private fun normalizedPart(part: String) = if (part in setOf("chest", "back", "legs", "shoulders", "arms", "abs")) part else "abs"
private fun saveWorkout(record: WorkoutRecord) { val user = FirebaseAuth.getInstance().currentUser ?: return; FirebaseFirestore.getInstance().collection("users").document(user.uid).collection("workouts").document(record.id).set(recordToMap(record)) }
private fun deleteWorkout(id: String) { val user = FirebaseAuth.getInstance().currentUser ?: return; FirebaseFirestore.getInstance().collection("users").document(user.uid).collection("workouts").document(id).delete() }
private fun recordToMap(record: WorkoutRecord): Map<String, Any?> = mapOf(
    "id" to record.id,
    "sourceRecordId" to record.id, "status" to "completed", "title" to record.title.ifBlank { null }, "memo" to null,
    "startedAt" to com.google.firebase.Timestamp(java.util.Date.from(java.time.LocalDate.parse(record.date).atTime(12, 0).atZone(java.time.ZoneId.systemDefault()).toInstant())),
    "endedAt" to com.google.firebase.Timestamp.now(),
    "exercises" to record.exercises.mapIndexed { index, exercise ->
        mapOf(
            "exerciseId" to exercise.preset.presetId,
            "presetId" to exercise.preset.presetId, "canonicalPresetId" to exercise.preset.presetId,
            "storageExerciseId" to exercise.preset.presetId, "sourceExerciseInstanceId" to exercise.id,
            "orderIndex" to index, "nameSnapshot" to exercise.preset.nameKo,
            "defaultUiPart" to exercise.preset.defaultUiPart,
            "nameKo" to exercise.preset.nameKo,
            "group" to exercise.preset.defaultUiPart,
            "sets" to exercise.sets.map { set ->
                val input = set.inputLoadValue.toDoubleOrNull() ?: 0.0
                val canonical = kg(set.inputLoadValue, set.inputLoadUnit) ?: 0.0
                mutableMapOf<String, Any?>(
                    "setId" to set.id, "sourceSetId" to set.id, "loadState" to set.loadState,
                    "reps" to (set.reps.toIntOrNull() ?: 0), "durationSeconds" to set.durationSeconds.toIntOrNull(), "completed" to set.completed,
                    "inputLoadValue" to input, "inputLoadUnit" to set.inputLoadUnit
                ).apply {
                    put(when (set.loadState) {
                        "added_weight" -> "addedWeightKg"
                        "assisted" -> "assistedWeightKg"
                        else -> "weightKg"
                    }, canonical)
                }
            }
        )
    }
)

private fun recordFromMap(document: com.google.firebase.firestore.DocumentSnapshot): WorkoutRecord? {
    val data = document.data ?: return null
    val exercises = (data["exercises"] as? List<*>)?.mapNotNull { rawExercise ->
        val exercise = rawExercise as? Map<*, *> ?: return@mapNotNull null
        val preset = ExercisePreset(
            presetId = (exercise["presetId"] ?: exercise["exerciseId"]) as? String ?: "",
            nameKo = (exercise["nameSnapshot"] ?: exercise["nameKo"]) as? String ?: "운동",
            defaultUiPart = (exercise["defaultUiPart"] ?: exercise["group"]) as? String ?: ""
        )
        val sets = (exercise["sets"] as? List<*>)?.mapNotNull { rawSet ->
            val set = rawSet as? Map<*, *> ?: return@mapNotNull null
            val canonical = set["weightKg"] ?: set["addedWeightKg"] ?: set["assistedWeightKg"]
            SetEntry(
                id = (set["sourceSetId"] ?: set["setId"]) as? String ?: UUID.randomUUID().toString(),
                loadState = set["loadState"] as? String ?: "external_load",
                inputLoadValue = (set["inputLoadValue"] as? Number)?.toString() ?: (canonical as? Number)?.toString() ?: "",
                inputLoadUnit = set["inputLoadUnit"] as? String ?: "kg",
                reps = (set["reps"] as? Number)?.toString() ?: "",
                durationSeconds = (set["durationSeconds"] as? Number)?.toString() ?: "",
                completed = set["completed"] as? Boolean ?: true
            )
        } ?: listOf(SetEntry())
        WorkoutEntry(preset = preset, sets = sets)
    } ?: return null
    val startedAt = data["startedAt"]
    val date = when (startedAt) {
        is com.google.firebase.Timestamp -> java.time.Instant.ofEpochSecond(startedAt.seconds).atZone(java.time.ZoneId.systemDefault()).toLocalDate().toString()
        is String -> startedAt.take(10)
        else -> today()
    }
    return WorkoutRecord(document.id, date, exercises, data["title"] as? String ?: "")
}
