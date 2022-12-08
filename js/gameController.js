(function() {
    angular.module('myGameOfLife').controller('gameController', function($scope) {

        $scope.title = "The Game Of Life";
        $scope.speed = 300; // default speed to start with..
        $scope.drawMode = false;

        $scope.cols = 100;
        $scope.rows = 50;

        $scope.color_off = "white"; // value = 0
        $scope.color_on = "black"; // value = 1
        $scope.color_visited = "#A1ED8C"; // value = 2

        $scope.field = new Array($scope.rows);
        $scope.rowIterator = new Array($scope.rows);
        $scope.colIterator = new Array($scope.cols);

        var isStarted;
        var myTimer;

        init();

        function init() {
            $scope.cycleCount = 0;
            $scope.drawMode = false;
            isStarted = false;

            // Rijen toevoegen aan speelbord
            for (var row = 0; row < $scope.rows; row++) {
                $scope.field[row] = new Array($scope.cols);
                // Kolommen toevoegen aan huidige rij
                for (var col = 0; col < $scope.cols; col++) {
                    $scope.field[row][col] = 0;
                }
            }

            // Iterators opvullen
            for (var row = 0; row < $scope.rows; row++) { $scope.rowIterator[row] = row; }
            for (var col = 0; col < $scope.cols; col++) { $scope.colIterator[col] = col; }
        }

        $scope.nextStep = function() {
            volgende();
        };

        $scope.start = function() {
            myTimer = setInterval(volgende, $scope.speed);
            isStarted = true;
        };

        $scope.stop = function() {
            clearInterval(myTimer);
            isStarted = false;
        };

        $scope.setSpeed = function() {
            if (isStarted == true) {
                clearInterval(myTimer);
                $scope.start();
            }
        };

        $scope.seedRnd = function() {
            var numberOfSeeds = ($scope.rows * $scope.cols) * 0.6; //60%
            var row, col;

            for (var x = 0; x < numberOfSeeds; x++) {
                row = Math.round(Math.random() * ($scope.rows - 1));
                col = Math.round(Math.random() * ($scope.cols - 1));
                //console.log('row: ' + row + ' / col: ' + col);
                var myValue = ($scope.field[row][col] == 1) ? 0 : 1;
                $scope.field[row][col] = myValue;
            }
        };

        $scope.resetField = function() {
            $scope.stop();
            init();
        };

        function volgende() {

            var newField = new Array($scope.rows);
            for (var i = 0; i < $scope.rows; i++) {
                newField[i] = new Array($scope.cols);
                for (var j = 0; j < $scope.cols; j++) {
                    //check element uit originele array en zet het resultaat in de nieuwe array
                    newField[i][j] = fieldNewValue(i, j);
                }
            }
            // Alle waarden zijn gechecked --> de resultaten nu in de 'hoofd'-array zetten
            copyArray(newField, $scope.field);
            $scope.cycleCount += 1;

            // ..en digest-cycle triggeren!..
            $scope.$apply();
        }

        function fieldNewValue(row, col) {
            var neighbors = countNeighbors(row, col);
            if ($scope.field[row][col] == 1) {
                //field is currently alive: we need to check these 3 rules:
                // 1. Less than 2 neighbors --> field dies of under-population
                // 2. More than 3 neighbors --> field dies of over-population
                // 3. Field has 2 or 3 neighbors --> field stays alive
                if (neighbors < 2 || neighbors > 3) return 2;
                else return 1;
            } else {
                //field is currently dead: we need to check this 1 rule:
                // 1. Field has 3 neighbors --> field gets alive
                if (neighbors == 3) return 1;
                else return $scope.field[row][col];
                //else return 0;
            }

        }

        function countNeighbors(row, col) {
            // 1 2 3    ==> bovenliggende rij
            // 4 x 5    ==> zelfde rij
            // 6 7 8    ==> onderliggende rij
            var counter = 0;

            // 1 2 3    (bovenliggende rij)
            if (row > 0) {
                if (col > 0) counter += $scope.field[row - 1][col - 1] == 1 ? 1 : 0; // 1
                counter += $scope.field[row - 1][col] == 1 ? 1 : 0; // 2
                if (col < ($scope.cols - 1)) counter += $scope.field[row - 1][col + 1] == 1 ? 1 : 0; // 3
            }

            // 4 x 5    (zelfde rij)
            if (col > 0) counter += $scope.field[row][col - 1] == 1 ? 1 : 0; // 4
            if (col < ($scope.cols - 1)) counter += $scope.field[row][col + 1] == 1 ? 1 : 0; // 5

            // 6 7 8    (onderliggende rij)
            if (row < ($scope.rows - 1)) {
                if (col > 0) counter += $scope.field[row + 1][col - 1] == 1 ? 1 : 0; // 6
                counter += $scope.field[row + 1][col] == 1 ? 1 : 0; // 7
                if (col < $scope.cols - 1) counter += $scope.field[row + 1][col + 1] == 1 ? 1 : 0; // 8
            }
            return counter;
        }

        function copyArray(arrFrom, arrTo) {
            for (var i = 0; i < $scope.rows; i++) {
                for (var j = 0; j < $scope.cols; j++) {
                    arrTo[i][j] = arrFrom[i][j];
                }
            }
        }

        function logArray(arr) {
            var result = "";
            for (var i = 0; i < $scope.rows; i++) {
                for (var j = 0; j < $scope.cols; j++) {
                    result += arr[i][j];
                }
                result += "\n";
            }
        }

        $scope.setBackgroundStyle = function(row, col) {
            var kleur = "";

            switch ($scope.field[row][col]) {
                case 0:
                    kleur = $scope.color_off;
                    break;
                case 1:
                    kleur = $scope.color_on;
                    break;
                case 2:
                    kleur = $scope.color_visited;
                    break;
            }

            return { 'background-color': kleur };
        };

        $scope.toggleCel = function(row, col, draw) {
            if (draw != 1 || $scope.drawMode == true) {
                $scope.field[row][col] = ($scope.field[row][col] != 1) ? 1 : 0;
            }
        };
    })

}());