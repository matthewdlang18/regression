// Global variables
let regressionChart = null;
let numObservationsInput;
let varianceXInput;
let varianceErrorInput;
let numObservationsValidation;
let varianceXValidation;
let varianceErrorValidation;
let seValueElement;
let rotateButton;
let clearButton;
let animationInProgress = false;
let originalLineData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    numObservationsInput = document.getElementById('numObservations');
    varianceXInput = document.getElementById('varianceX');
    varianceErrorInput = document.getElementById('varianceError');
    numObservationsValidation = document.getElementById('numObservations-validation');
    varianceXValidation = document.getElementById('varianceX-validation');
    varianceErrorValidation = document.getElementById('varianceError-validation');
    seValueElement = document.getElementById('seValue');
    rotateButton = document.getElementById('rotateButton');
    clearButton = document.getElementById('clearButton');
    
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
    
    rotateButton.addEventListener('click', rotateRegressionLine);
    clearButton.addEventListener('click', clearVisualization);
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
    const numObservations = parseInt(numObservationsInput.value);
    const varianceX = parseFloat(varianceXInput.value);
    const varianceError = parseFloat(varianceErrorInput.value);
    
    // Calculate v = sqrt(Variance of X)
    const v = Math.sqrt(varianceX);
    
    // Calculate se = sqrt(Variance of error term/(Number of observations times Variance of X))
    const se = Math.sqrt(varianceError / (numObservations * varianceX));
    
    // Update the SE value display
    seValueElement.textContent = se.toFixed(2);
    
    // Calculate points for the line with slope 1
    const x1 = 3 - v;
    const y1 = x1; // Since slope is 1 and we want the line to pass through (x1, x1)
    const x2 = 3 + v;
    const y2 = x2; // Since slope is 1 and we want the line to pass through (x2, x2)
    
    // Update the regression line data
    const lineData = [
        { x: x1, y: y1 },
        { x: x2, y: y2 }
    ];
    
    regressionChart.data.datasets[0].data = lineData;
    
    // Store the original line data for rotation
    originalLineData = [...lineData];
    
    // Update the chart
    regressionChart.update();
    
    // Log the values for debugging
    console.log(`Variance of X: ${varianceX}, v: ${v}, se: ${se}`);
    console.log(`Line points: (${x1}, ${y1}) to (${x2}, ${y2})`);
}

// Rotate the regression line animation
function rotateRegressionLine() {
    if (animationInProgress) return;
    
    // Disable the button during animation
    animationInProgress = true;
    rotateButton.disabled = true;
    
    // Get the midpoint of the line
    const midX = (originalLineData[0].x + originalLineData[1].x) / 2;
    const midY = (originalLineData[0].y + originalLineData[1].y) / 2;
    
    // Original slope is 1
    let currentSlope = 1;
    let direction = 1; // 1 for increasing slope, -1 for decreasing
    let animationStep = 0;
    const totalSteps = 200; // Total animation steps
    const maxSlope = 2; // Maximum slope to reach
    
    // Animation interval
    const animationInterval = setInterval(() => {
        animationStep++;
        
        // Calculate new slope based on animation progress
        if (direction === 1 && currentSlope >= maxSlope) {
            direction = -1; // Start decreasing
        } else if (direction === -1 && currentSlope <= 0) {
            direction = 1; // Start increasing again
        }
        
        // Update slope
        currentSlope += 0.02 * direction;
        
        // Calculate new points based on the slope and midpoint
        const dx = 1; // Distance from midpoint
        const newPoint1 = {
            x: midX - dx,
            y: midY - currentSlope * dx
        };
        
        const newPoint2 = {
            x: midX + dx,
            y: midY + currentSlope * dx
        };
        
        // Update the line
        regressionChart.data.datasets[0].data = [newPoint1, newPoint2];
        
        // Update the chart
        regressionChart.update();
        
        // Check if animation is complete
        if (animationStep >= totalSteps) {
            clearInterval(animationInterval);
            
            // Reset to original line
            regressionChart.data.datasets[0].data = originalLineData;
            regressionChart.update();
            
            // Re-enable the button
            animationInProgress = false;
            rotateButton.disabled = false;
        }
    }, 30);
}

// Clear the visualization
function clearVisualization() {
    // Reset input fields to default values
    numObservationsInput.value = 100;
    varianceXInput.value = 1;
    varianceErrorInput.value = 400;
    
    // Clear validation messages
    numObservationsValidation.textContent = '';
    varianceXValidation.textContent = '';
    varianceErrorValidation.textContent = '';
    
    // Update the regression line
    updateRegressionLine();
}
