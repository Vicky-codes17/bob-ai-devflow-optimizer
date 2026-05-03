// utils/dateHelper.js - Date Calculation Utilities

/**
 * Calculate days remaining until deadline
 * @param {string} deadline - ISO date string
 * @returns {number} Days remaining (negative if overdue)
 */
function calculateDaysRemaining(deadline) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get priority level based on deadline
 * @param {string} deadline - ISO date string
 * @returns {string} Priority level: 'high', 'medium', or 'low'
 */
function getPriority(deadline) {
  const daysRemaining = calculateDaysRemaining(deadline);
  
  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining <= 1) return 'high';
  if (daysRemaining <= 3) return 'medium';
  return 'low';
}

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date (e.g., "May 1, 2026")
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format date to short string
 * @param {string} dateString - ISO date string
 * @returns {string} Short formatted date (e.g., "May 1")
 */
function formatDateShort(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get relative time string
 * @param {string} deadline - ISO date string
 * @returns {string} Relative time (e.g., "in 2 days", "tomorrow", "overdue")
 */
function getRelativeTime(deadline) {
  const days = calculateDaysRemaining(deadline);
  
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days <= 7) return `in ${days} days`;
  if (days <= 30) return `in ${Math.ceil(days / 7)} week${Math.ceil(days / 7) === 1 ? '' : 's'}`;
  return `in ${Math.ceil(days / 30)} month${Math.ceil(days / 30) === 1 ? '' : 's'}`;
}

/**
 * Check if date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the past
 */
function isPast(dateString) {
  return new Date(dateString) < new Date();
}

/**
 * Check if date is today
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is today
 */
function isToday(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Add days to a date
 * @param {string} dateString - ISO date string
 * @param {number} days - Number of days to add
 * @returns {string} New date as ISO string
 */
function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

/**
 * Get date range for next N days
 * @param {number} days - Number of days
 * @returns {Array<string>} Array of ISO date strings
 */
function getDateRange(days = 7) {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

module.exports = {
  calculateDaysRemaining,
  getPriority,
  formatDate,
  formatDateShort,
  getRelativeTime,
  isPast,
  isToday,
  addDays,
  getDateRange
};

// Made with Bob