var app = angular.module('TicketPrint', []);
app.controller('MainController', function ($scope) {
    var canvas = document.getElementById('ticketCvs');
    var canvasContainer = $('.canvasContainer');
    var ctx = canvas.getContext('2d');

    var mainImage = new Image();
    var barcodeImage = new Image();

    $scope.ticketInfo = {};

    var dimensions = {
        margin: 30,
        input: {
            height: 60,
            width: 280
        },
        image: {
            height: 380,
            width: 1210
        },
        barcode: {
            height: 420,
            width: 160
        }
    };

    (function init() {
        var width = canvasContainer.width();
        var height = canvasContainer.height();

        canvas.width = width * 2;//horizontal resolution (?) - increase for better looking text
        canvas.height = height * 2;//vertical resolution (?) - increase for better looking text
        canvas.style.width = width + 'px';//actual width of canvas
        canvas.style.height = height + 'px';//actual height of canvas

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

            var textBaselineFix = 40;
            var models = ['block', 'row', 'seat', 'price'];
            ctx.font = "25px sans-serif";
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
        element.style.width = '10cm';
        win.document.body.innerHTML = element.outerHTML;
        win.print();
        //win.close();
    }
});