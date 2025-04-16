# Regression Coefficient Standard Error Visualization

An interactive web application for understanding the standard error of a regression coefficient.

## Overview

This application provides a visual demonstration of how the standard error of a regression coefficient is affected by different parameters such as the number of observations, variance of X, and variance of the error term.

## Features

- Interactive graph with x and y axes ranging from 0 to 5
- Input fields for:
  - Number of observations (initial value: 100)
  - Variance of X (initial value: 1)
  - Variance of error term (initial value: 400)
- Real-time validation of input values
- Dynamic visualization of the regression line based on input parameters

## How to Use

1. Open the application in a web browser
2. The graph will display a regression line with slope 1 passing through points determined by the variance of X
3. Adjust the input values to see how they affect the regression line:
   - Number of observations: Must be an integer greater than 2
   - Variance of X: Must be greater than 0 and less than 6
   - Variance of error term: Must be greater than 0
4. The line will automatically update as you change the inputs

## Technical Details

- The application calculates v = sqrt(Variance of X)
- The regression line is drawn through the points (3-v, 3-v) and (3+v, 3+v)
- The line always has a slope of 1

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js for data visualization

## License

This project is open source and available under the MIT License.

## Author

Created by Dick Startz
