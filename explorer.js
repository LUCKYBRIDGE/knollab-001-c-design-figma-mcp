const repositories = Object.freeze({
  a: 'knollab-001-a-ai-only',
  b: 'knollab-001-b-design-md',
  c: 'knollab-001-c-design-figma-mcp',
  d: 'knollab-001-d-design-figma-mcp-actively'
});

const requestedVersion = new URLSearchParams(window.location.search).get('version');
const version = ['1', '2', '3'].includes(requestedVersion) ? requestedVersion : '3';
const originalPath = `versions/v${version}/index.html`;

document.querySelectorAll('[data-version]').forEach(link => {
  const selected = link.dataset.version === version;
  link.classList.toggle('is-active', selected);
  if (selected) link.setAttribute('aria-current', 'page');
  else link.removeAttribute('aria-current');
});

document.querySelectorAll('[data-experiment]').forEach(link => {
  const experiment = link.dataset.experiment;
  const targetVersion = experiment === 'd' ? '1' : version;
  link.href = experiment === 'c'
    ? `?version=${targetVersion}`
    : `https://luckybridge.github.io/${repositories[experiment]}/?version=${targetVersion}`;
});

document.getElementById('context-title').textContent = `C 실험 · 버전 ${version}`;
document.getElementById('open-original').href = originalPath;
const frame = document.getElementById('experience-frame');
frame.src = originalPath;
frame.title = `C 실험 버전 ${version} 카페 주문 체험`;
