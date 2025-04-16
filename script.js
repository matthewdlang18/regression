// Global variables
let regressionChart = null;
let numObservationsInput;
let varianceXInput;
let varianceErrorInput;
let numObservationsValidation;
let varianceXValidation;
let varianceErrorValidation;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    numObservationsInput = document.getElementById('numObservations');
    varianceXInput = document.getElementById('varianceX');
    varianceErrorInput = document.getElementById('varianceError');
    numObservationsValidation = document.getElementById('numObservations-validation');
    varianceXValidation = document.getElementById('varianceX-validation');
    varianceErrorValidation = document.getElementById('varianceError-validation');
    
    // Create the chart
    createRegressionChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial update
    updateRegressionLine();
});

// Create the regression chart
function createRegressionChart() {
    const ctx = document.getElementById('regressionChart').getContext('2d');
    
    // Create the chart
    regressionChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                // Regression line
                {
                    type: 'line',
                    label: 'Regression Line',
                    data: [],
                    borderColor: '#0056b3',
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderWidth: 2,
                    tension: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 5,
                    title: {
                        display: true,
                        text: 'X'
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                },
                y: {
                    min: 0,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Y'
                    },
                    grid: {
                        color: '#e0e0e0'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `(${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                        }
                    }
                }
            }
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    numObservationsInput.addEventListener('input', validateAndUpdate);
    varianceXInput.addEventListener('input', validateAndUpdate);
    varianceErrorInput.addEventListener('input', validateAndUpdate);
}

// Validate inputs and update the chart
function validateAndUpdate() {
    let isValid = true;
    
    // Validate number of observations
    const numObservations = parseInt(numObservationsInput.value);
    if (isNaN(numObservations) || numObservations < 3) {
        numObservationsValidation.textContent = 'Must be an integer greater than 2';
        isValid = false;
    } else {
        numObservationsValidation.textContent = '';
    }
    
    // Validate variance of X
    const varianceX = parseFloat(varianceXInput.value);
    if (isNaN(varianceX) || varianceX <= 0 || varianceX >= 6) {
        varianceXValidation.textContent = 'Must be greater than 0 and less than 6';
        isValid = false;
    } else {
        varianceXValidation.textContent = '';
    }
    
    // Validate variance of error term
    const varianceError = parseFloat(varianceErrorInput.value);
    if (isNaN(varianceError) || varianceError <= 0) {
        varianceErrorValidation.textContent = 'Must be greater than 0';
        isValid = false;
    } else {
        varianceErrorValidation.textContent = '';
    }
    
    // Update the chart if all inputs are valid
    if (isValid) {
        updateRegressionLine();
    }
}

// Update the regression line based on input values
function updateRegressionLine() {
    // Get input values
    const varianceX = parseFloat(varianceXInput.value);
    
    // Calculate v = sqrt(Variance of X)
    const v = Math.sqrt(varianceX);
    
    // Calculate points for the line with slope 1
    const x1 = 3 - v;
    const y1 = x1; // Since slope is 1 and we want the line to pass through (x1, x1)
    const x2 = 3 + v;
    const y2 = x2; // Since slope is 1 and we want the line to pass through (x2, x2)
    
    // Update the regression line data
    regressionChart.data.datasets[0].data = [
        { x: x1, y: y1 },
        { x: x2, y: y2 }
    ];
    
    // Update the chart
    regressionChart.update();
    
    // Log the values for debugging
    console.log(`Variance of X: ${varianceX}, v: ${v}`);
    console.log(`Line points: (${x1}, ${y1}) to (${x2}, ${y2})`);
}
