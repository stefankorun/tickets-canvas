var app = angular.module('TicketPrint', []);
app.controller('MainController', function ($scope) {
    var canvas = document.getElementById('ticketCvs');
    var canvasContainer = $('.canvasContainer');
    var ctx = canvas.getContext('2d');

    var mainImage = new Image();
    mainImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEUAAACnej3aAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';
    var barcodeImage = new Image();
    barcodeImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEUAAACnej3aAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';


    $scope.ticketInfo = {};

    var dimensions = {
        margin: 15,
        input: {
            height: 30,
            width: 140
        },
        image: {
            height: 190,
            width: 605
        },
        barcode: {
            height: 210,
            width: 80
        }
    };

    (function init() {
        var width = canvasContainer.width();
        var height = canvasContainer.height();

        canvas.width = width * 3;//horizontal resolution (?) - increase for better looking text
        canvas.height = height * 3;//vertical resolution (?) - increase for better looking text
        canvas.style.width = width + 'px';//actual width of canvas
        canvas.style.height = height + 'px';//actual height of canvas
        ctx.setTransform(3, 0, 0, 3, 0, 0);

        ctx.translate(0.5, 0.5);
    }());

    function drawTicket() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw main image
        ctx.drawImage(
            mainImage,
            dimensions.margin,
            dimensions.margin,
            dimensions.image.width,
            dimensions.image.height
        );

        // draw barcode image
        ctx.drawImage(
            barcodeImage,
            2 * dimensions.margin + dimensions.image.width,
            dimensions.margin,
            dimensions.barcode.width,
            dimensions.barcode.height
        );

        // draw inputs
        ctx.lineWidth = 0.4;
        for (var i = 0; i < 4; ++i) {
            ctx.strokeRect(
                dimensions.margin + i * (dimensions.margin + dimensions.input.width),
                2 * dimensions.margin + dimensions.image.height,
                dimensions.input.width,
                dimensions.input.height
            );

            var textBaselineFix = 20;
            var models = ['block', 'row', 'seat', 'price'];
            ctx.font = "17px sans-serif";
            ctx.fillText(
                $scope.ticketInfo[models[i]],
                2 * dimensions.margin + i * (dimensions.margin + dimensions.input.width),
                2 * dimensions.margin + dimensions.image.height + textBaselineFix
            );
        }
    }

    drawTicket();

    function loadImage(input, targetImage) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function (e) {
                targetImage.src = e.target.result;
                drawTicket();
            }
        }
    }

    $("#mainPicture").change(function () {
        loadImage(this, mainImage);
    });
    $("#barcodePicture").change(function () {
        loadImage(this, barcodeImage);
    });

    $scope.$watch('ticketInfo', function (value) {
        drawTicket();
    }, true);

    $scope.printTicket = function () {
        var win = window.open();
        var element = document.createElement('img');
        element.src = canvas.toDataURL();
        element.style.width = '17cm';
        win.document.body.innerHTML = element.outerHTML;
        win.print();
        win.close();
    }
});