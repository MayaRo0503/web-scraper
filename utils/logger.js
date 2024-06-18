// Define color codes for console text formatting
const colors = {
  Reset: "\x1b[0m", // Reset color
  FgRed: "\x1b[31m", // Red color for errors
  FgBlue: "\x1b[34m", // Blue color for info
  FgWhite: "\x1b[37m", // White color (default)
  FgCyan: "\x1b[36m", // Cyan color for trace
  FgGray: "\x1b[90m", // Gray color for log
};

// Define logging levels with corresponding colors
const levels = {
  log: colors.FgGray,
  info: colors.FgBlue,
  trace: colors.FgCyan,
  error: colors.FgRed,
};

// Function to get the current timestamp in ISO format
function getTimestamp() {
  return new Date().toISOString();
}

// Function to log a message with a specified level and arguments
function logMessage(level, ...args) {
  const color = levels[level] || colors.FgWhite; // Default to white if level is not found
  const timestamp = getTimestamp(); // Get the current timestamp
  const formattedArgs = args.map(
    (arg) => (arg instanceof Error ? arg.stack : arg) // Format errors to show stack trace
  );
  console.log(`${color}[${timestamp}]${colors.Reset}:`, ...formattedArgs); // Log the message with color and timestamp
}

// Export the logging functions for different levels
module.exports = {
  log: (...args) => logMessage("log", ...args), // General log
  info: (...args) => logMessage("info", ...args), // Info log
  trace: (...args) => logMessage("trace", ...args), // Trace log
  error: (...args) => logMessage("error", ...args), // Error log
};
