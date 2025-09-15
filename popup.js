// popup.js
const $ = sel => document.querySelector(sel);

function msToHMS(ms) {
	if (ms < 0) ms = 0;
	const s = Math.floor(ms / 1000);
	const hh = Math.floor(s / 3600).toString().padStart(2, '0');
	const mm = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
	const ss = Math.floor(s % 60).toString().padStart(2, '0');
	return `${hh}:${mm}:${ss}`;
}

async function send(msg) {
	return new Promise(res => chrome.runtime.sendMessage(msg, res));
}

function show(id) {
	document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
	$(id).classList.remove('hidden');
}

function renderProblems(state) {
	const list = $('#problems');
	list.innerHTML = '';
	for (const p of state.problems || []) {
		const li = document.createElement('li');
		const status = p.verdict === 'OK'
			? '<span class="badge ok">AC</span>'
			: (p.submissions?.length
				? '<span class="badge fail">Attempted</span>'
				: '<span class="badge pending">Pending</span>');
		li.innerHTML = `<strong>${p.key}.</strong> <a href="${p.url}" target="_blank" rel="noopener">${p.title}</a> ${status}`;
		list.appendChild(li);
	}
}

function renderContest(state) {
	const end = state.endTime;
	const now = Date.now();
	const remainingMs = end - now;

	$('#countdown').textContent = msToHMS(remainingMs);
	const timerEl = $('.timer');
	if (remainingMs < 15 * 60 * 1000) {
		timerEl.classList.add('warning');
	} else {
		timerEl.classList.remove('warning');
	}

	const details = state.config || {};
	$('#contestDetails').innerHTML = `
		<div>Duration: ${Math.floor(details.durationMinutes / 60)}H ${details.durationMinutes % 60}M</div>
		<div>Type: ${details.type ? details.type.charAt(0).toUpperCase() + details.type.slice(1) : ''}</div>
		<div>Difficulty: ${details.difficulty ? details.difficulty.charAt(0).toUpperCase() + details.difficulty.slice(1) : ''}</div>
		<div>Handle: ${details.handle || ''}</div>
	`;
	renderProblems(state);
}

function renderResults(state) {
	const total = state.problems?.length || 0;
	const solved = state.problems?.filter(p => p.verdict === 'OK').length || 0;
	const attempts = state.problems?.reduce((acc, p) => acc + (p.submissions?.length || 0), 0) || 0;
	const successRate = total ? Math.round((solved / total) * 100) : 0;
	$('#resultsSummary').innerHTML = `
		<div>Total problems: ${total}</div>
		<div>Solved: ${solved}</div>
		<div>Total attempts: ${attempts}</div>
		<div>Success rate: ${successRate}%</div>
	`;

	const backContestBtn = $('#backContestBtn');
	const newContestBtn = $('#newContestBtn');

	const allSolved = state.problems?.every(p => p.verdict === 'OK');
	const contestEnded = state.status === 'ended';

	if (allSolved || contestEnded) {
		backContestBtn.classList.add('hidden');
		backContestBtn.disabled = true;

		newContestBtn.classList.remove('hidden');
		newContestBtn.disabled = false;
	} else {
		backContestBtn.classList.remove('hidden');
		backContestBtn.disabled = false;

		newContestBtn.classList.remove('hidden');
		newContestBtn.disabled = true;
	}
}

async function syncFromState() {
	if (window.__forceIdle || (window.__forceState && window.__forceState.status === 'idle')) {
		show('#view-start');
		return;
	}

	if (window.__startingContest) {
		return;
	}

	if (!document.querySelector('#view-results').classList.contains('hidden')) {
		return;
	}
	
	const resp = await send({ type: 'get_state' });
	if (!resp.ok) return;
	const state = resp.state;

	if (!state || state.status === 'idle') {
		show('#view-start');
		return;
	}
	
	const allSolved = state.problems?.every(p => p.verdict === 'OK');
	const contestEnded = state.status === 'ended';

	if (contestEnded || allSolved) {
		renderResults(state);
		show('#view-results');
		return;
	}

	if (state.status === 'running') {
		show('#view-contest');
		renderContest(state);
	}
}

function tick() {
	syncFromState();
}

function updateTagsView() {
	const contestTypeEl = $('#contestType');
	const tagsContainer = $('#tagsContainer');
	if (!contestTypeEl || !tagsContainer) return;

	const contestType = contestTypeEl.value;
	const checkboxes = document.querySelectorAll('#tagsList input[type="checkbox"]');

	if (contestType === 'general') {
		tagsContainer.style.display = 'none';
		tagsContainer.classList.add('hidden');
		if (checkboxes) {
			checkboxes.forEach(cb => cb.checked = false);
		}
	} else {
		tagsContainer.style.display = '';
		tagsContainer.classList.remove('hidden');
	}
}

function populateTags() {
	const tags = [
		'2-sat', 'binary search', 'bitmasks', 'brute force', 'chinese remainder theorem',
		'combinatorics', 'constructive algorithms', 'data structures', 'dfs and similar',
		'divide and conquer', 'dp', 'dsu', 'expression parsing', 'fft', 'flows',
		'games', 'geometry', 'graph matchings', 'graphs', 'greedy', 'hashing',
		'implementation', 'interactive', 'math', 'matrices', 'meet-in-the-middle',
		'number theory', 'probabilities', 'schedules', 'shortest paths', 'sortings',
		'string suffix structures', 'strings', 'ternary search', 'trees', 'two pointers'
	];
	const tagsList = $('#tagsList');
	if (!tagsList) return;
	tagsList.innerHTML = '';
	tags.forEach(tag => {
		const safeId = `tag-${tag.replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
		const div = document.createElement('div');
		div.classList.add('tag-item');
		div.innerHTML = `<input type="checkbox" id="${safeId}" value="${tag}" /><label for="${safeId}">${tag}</label>`;
		tagsList.appendChild(div);
	});
}

function handleTagSelection(e) {
	const contestType = $('#contestType').value;
	if (contestType === 'topic') {
		const checkboxes = document.querySelectorAll('#tagsList input[type="checkbox"]');
		checkboxes.forEach(cb => {
			if (cb !== e.target) {
				cb.checked = false;
			}
		});
	}
}

function validateHandle() {
	const handle = $('#handle').value.trim();
	const errorEl = $('#handleError');
	const startBtn = $('#startBtn');

	if (!handle) {
		errorEl.style.display = 'block';
		startBtn.disabled = true;
		return false;
	} else {
		errorEl.style.display = 'none';
		startBtn.disabled = false;
		return true;
	}
}

const contestTypeEl = $('#contestType');
if (contestTypeEl) contestTypeEl.addEventListener('change', updateTagsView);

const tagsListEl = $('#tagsList');
if (tagsListEl) tagsListEl.addEventListener('change', handleTagSelection);

$('#handle').addEventListener('input', validateHandle);

const startBtn = $('#startBtn');
if (startBtn) {
	startBtn.addEventListener('click', async () => {
		if (!validateHandle()) return;

		window.__startingContest = true;
		window.__forceIdle = false;
		window.__forceState = null;

		const handle = $('#handle').value.trim();
		const hours = Math.max(0, Math.min(3, parseInt($('#hours').value || '0', 10)));
		const minutes = Math.max(0, Math.min(59, parseInt($('#minutes').value || '0', 10)));
		const durationMinutes = hours * 60 + minutes;
		const numProblems = Math.max(1, Math.min(10, parseInt($('#numProblems').value || '4', 10)));
		const type = $('#contestType').value;
		const difficulty = $('#difficulty').value;
		
		let tags = [];
		if (type !== 'general') {
			const checkedCheckboxes = document.querySelectorAll('#tagsList input[type="checkbox"]:checked');
			tags = Array.from(checkedCheckboxes).map(cb => cb.value);
		}

		if (type === 'topic' && tags.length !== 1) {
			alert('For "Topic-based" contests, you must select exactly one tag.');
			window.__startingContest = false;
			return;
		}
		
		startBtn.disabled = true;
		startBtn.textContent = "Starting contest...";

		const startResp = await send({ type: 'start_contest', payload: { durationMinutes, numProblems, type, tags, difficulty, handle } });

		startBtn.disabled = false;
		startBtn.textContent = "Start Contest";
		window.__startingContest = false;

		if (!startResp.ok) {
			alert('Failed to start contest: ' + startResp.error);
			return;
		}

		syncFromState();
	});
}

const showResultsBtn = $('#showResultsBtn');
if (showResultsBtn) {
	showResultsBtn.addEventListener('click', async () => {
		const resp = await send({ type: 'get_state' });
		if (!resp.ok) return;
		renderResults(resp.state);
		show('#view-results');
	});
}

const newContestBtn = $('#newContestBtn');
if (newContestBtn) {
	newContestBtn.addEventListener('click', async () => {
		if (newContestBtn.disabled) return;

		try {
			await send({ type: 'end_contest' });
		} catch (e) {}

		window.__forceIdle = true;
		window.__forceState = { status: 'idle' };
		window.__startingContest = false;

		show('#view-start');
		$('#resultsSummary').innerHTML = '';
		$('#backContestBtn').classList.add('hidden');
		$('#backContestBtn').disabled = true;

		newContestBtn.classList.add('hidden');
		newContestBtn.disabled = true;

		validateHandle();
	});
}

const backContestBtn = $('#backContestBtn');
if (backContestBtn) {
	backContestBtn.addEventListener('click', () => {
		if (backContestBtn.disabled) return;
		show('#view-contest');
		syncFromState();
	});
}

chrome.runtime.onMessage.addListener((msg) => {
	if (msg?.type === 'state_updated') {
		if (window.__forceIdle) return;
		syncFromState();
	}
});

populateTags();
updateTagsView();
validateHandle();
setInterval(tick, 1000);
syncFromState();