// Accessibility checks with axe-core against WCAG 2.2 level A and AA
// (WCAG 2.2 includes 2.0 and 2.1, so all their A/AA rules are checked too).

import AxeBuilder from '@axe-core/playwright';

export const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// "wcag143" -> "1.4.3"
function wcagCriteria(tags) {
  return tags
    .map((tag) => tag.match(/^wcag(\d)(\d)(\d+)$/))
    .filter(Boolean)
    .map(([, principle, guideline, criterion]) => `${principle}.${guideline}.${criterion}`);
}

// One short line per violation, used as the step name in the report, e.g.
// "[serious] WCAG 1.4.3 color-contrast: Elements must meet minimum color contrast ratio thresholds — 78 element(s)"
export function formatViolationSummary(violation) {
  const criteria = wcagCriteria(violation.tags).join(', ') || 'best practice';
  return (
    `[${violation.impact}] WCAG ${criteria} ${violation.id}: ${violation.help}` +
    ` — ${violation.nodes.length} element(s)`
  );
}

// Details of one violation: why it matters, where, and how to fix it
export function formatViolationDetails(violation) {
  const lines = [
    formatViolationSummary(violation),
    '',
    `Why it matters: ${violation.description}`,
    `More info: ${violation.helpUrl}`,
    '',
    'Elements:',
  ];
  violation.nodes.forEach((node, index) => {
    lines.push(
      `${index + 1}) Selector: ${node.target.join(' ')}`,
      `   HTML: ${node.html}`,
      `   How to fix: ${node.failureSummary.replace(/\n\s*/g, ' ')}`,
    );
  });
  return lines.join('\n');
}

// Full readable report for the page: all violations
export function formatViolationsReport(pageName, url, violations) {
  if (violations.length === 0) {
    return `Accessibility check: ${pageName}\nURL: ${url}\n\nNo WCAG 2.2 A/AA violations found.`;
  }

  const lines = [
    `Accessibility check: ${pageName}`,
    `URL: ${url}`,
    `Standard: WCAG 2.2, levels A and AA`,
    `Violations: ${violations.length}`,
    '',
  ];

  violations.forEach((violation, index) => {
    lines.push(`${index + 1}. ${formatViolationDetails(violation)}`, '');
  });

  return lines.join('\n');
}

// Scans the current page and returns the axe violations
export async function scanAccessibility(page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  return results.violations;
}
