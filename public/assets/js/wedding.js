if (wedding===undefined){
    var wedding={};
}


wedding.createPageMgr = function () {
    var cssClass={
        weddingNavBarContainer: ".wedding-nav-bar",
        weddingMenuContainerId:"#bs-example-navbar-collapse-1",
        weddingMenuButtonId:"#wedding-menu-button"

    };


    //setup scrolling
    $(function() {
        $(cssClass.weddingNavBarContainer + ' a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {

                    if($(cssClass.weddingMenuContainerId).hasClass("in")){
                        $(cssClass.weddingMenuButtonId).click();
                    }

                    $('html,body').animate({
                        scrollTop: target.offset().top-50
                    }, 500);
                    return false;
                }
            }
        });
    });



    // cookie management stuff
    /*cookie management */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

};

wedding.initializeCarousel= function(){

    var carouselImgSrcs= [];
    carouselImgSrcs.push("assets/images/wedding-carousel-1.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-2.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-3.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-4.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-5.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-6.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-7.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-8.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-9.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-10.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-11.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-12.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-13.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-14.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-15.jpg");
    carouselImgSrcs.push("assets/images/wedding-carousel-16.jpg");

    var carouselImgTotal = 5;

    var carouselItemsContainer =  $(".carousel-inner");
    var carouselIndicatorsContainer = $('.carousel-indicators');

    for ( var i = 0; i < carouselImgTotal; i++ ) {
        var imgIndex = Math.floor(Math.random() * carouselImgSrcs.length);
        var imgSrc =carouselImgSrcs[imgIndex];
        carouselImgSrcs.splice(imgIndex,1);

        var carouselIndicatorDivStr = "<li data-target='#greeting-carousel' data-slide-to='" + i
            +"' class='" +(i===0?" active":"")+"'></li>";

        var carouselItemDivStr = "<div class='item " + (i===0?" active":"") + "'>";
        carouselItemDivStr += "<img class='greeting-carousel-img' " +
            " src='"+ imgSrc + "'"+
            " alt='greeting " + i+1 +"'></div>";
        carouselIndicatorsContainer.append(carouselIndicatorDivStr);
        carouselItemsContainer.append(carouselItemDivStr);
    }

}


//================================
//controllers
//================================
var ngWeddingApp = angular.module('ngWeddingApp',[]);

ngWeddingApp.controller('navBarController',['$scope',navBarController]);

function navBarController($scope){

    $scope.showPoll=function(){
        $("#wedding-poll").modal("toggle");

    };
    $scope.showDateRequest=function(){
        $("#wedding-request-date-justin").modal("toggle");
    };
    $scope.showMusicRequest=function(){
        $("#wedding-request-music").modal("toggle");
    };
    $scope.showDanceMoves=function(){
        $("#wedding-dance-moves").modal("toggle");
        var danceImageElement = $(".wedding-dance-img-1");
        if (danceImageElement.length===0){
            var imgString= "<img  class='img-responsive wedding-dance-img-1' src='assets/images/amazing-dance-moves.gif'>";
            $("#wedding-dance-moves-container-1").prepend(imgString);
        }
        var danceVideoElement = $(".wedding-dance-video-1");
        if (danceVideoElement.length===0){
            var videoString= "<video class='img-responsive wedding-dance-video-1' controls><source src='assets/video/dance2.mp4'/></video>";
            $("#wedding-dance-moves-container-2").prepend(videoString);
        }


    };

};

ngWeddingApp.controller('weddingSeatFinderController',['$scope','$http',weddingSeatFinderController]);
function weddingSeatFinderController($scope,$http){
    $scope.seatingArrangement={};
    $http.get('/api/seatingArrangement')
        .success(function(data) {
            $scope.seatingArrangement=data;
        })
        .error(function () {
            console.log("error getting seating arrangements!!!!!!!!!");
        });
};



ngWeddingApp.controller('weddingModalController',['$scope','$http',weddingModalController]);
function weddingModalController($scope,$http){
    $scope.weddingToast="";
    var pollQuestions={};
    $scope.showPollFields={};
    $scope.pollQuestion;
    $scope.sendPollAnswer=function(){
        var pollResultsData={}
        pollResultsData.QID=$scope.pollQuestion._id;
        pollResultsData.A=$scope.pollChosenAnswer;
        $http.post('/api/pollResults',pollResultsData)
            .success(function(data) {
                showWeddingToast("Thanks for participating in the poll");
                $scope.showPollFields.showPollQuestionsContainer=false;
                var graphData = accumulatePollResults(data);
                drawChart(graphData);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    function drawChart(graphData){
        var data = {
            // A labels array that can contain any sort of values
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            // Our series array that contains series objects or in this case series data arrays
            series: [
                [5, 2, 4, 2, 0]
            ]
        };

        var options={
            fullWidth: true,
            centerBars: false
        };

        var pieChartData={

            series: graphData.series
        }

        var sum = function(a, b) { return a + b };
        var seriesTotal = graphData.series.reduce(sum);
        var adjustedLabels = [];
        $.each(graphData.labels,function(index, labelVal){
            adjustedLabels.push(labelVal + " (" + Math.round(graphData.series[index]/seriesTotal *100) + "%)" );
        });

        pieChartData.labels = adjustedLabels;

       // new Chartist.Bar('.ct-chart', graphData,options);
        //new Chartist.Pie('.ct-chart', graphData);
        var responsiveOptions = [
            ['screen and (min-width: 240px)', {
                chartPadding: 15,
                labelOffset: 30,
                labelDirection: 'explode'
            }],
            ['screen and (min-width: 468px)', {
                chartPadding: 30,
                labelOffset: 60,
                labelDirection: 'explode'
            }],
            ['screen and (min-width: 1024px)', {
                labelOffset: 80,
                chartPadding: 20,
                labelDirection: 'explode'

            }]
        ];

        new Chartist.Pie('.ct-chart', pieChartData,{
        },responsiveOptions);

    };

    function accumulatePollResults(data){
        var totals ={}
            totals["A1"]=0;
            totals["A2"]=0;
            totals["A3"]=0;
            totals["A4"]=0;
            totals["A5"]=0;
        var results={
            labels:[],
            series:[]
        };
        var series1=[];

        var maxVal=0
        $.each(data,function(index,pollResult){
//            console.log("index: +" + index + ": " +pollResult.A);
            totals[pollResult.A]++;
        });


        for (i = 1; i < 6; i++) {
            var answerString= "A"+i;
            if($scope.pollQuestion[answerString]!==undefined){
                results.labels.push($scope.pollQuestion[answerString]);
                results.series.push(totals[answerString]);
                //series1.push(totals[answerString]);
            }
        }

        return results;

    }
    function initShowPollFields(){
        $scope.pollChosenAnswer="";
        $scope.showPollFields={};
        $scope.pollQuestion.imgSrc= ($scope.pollQuestion.imgSrc===undefined?"assets/images/poll-question-default.jpg":$scope.pollQuestion.imgSrc);
        $scope.showPollFields.Q= ($scope.pollQuestion.Q===undefined?false:true);
        $scope.showPollFields.A1= ($scope.pollQuestion.A1===undefined?false:true);
        $scope.showPollFields.A2= ($scope.pollQuestion.A2===undefined?false:true);
        $scope.showPollFields.A3= ($scope.pollQuestion.A3===undefined?false:true);
        $scope.showPollFields.A4= ($scope.pollQuestion.A4===undefined?false:true);
        $scope.showPollFields.A5= ($scope.pollQuestion.A5===undefined?false:true);
        $scope.showPollFields.showPollQuestionsContainer=true;
        $scope.showPollFields.showNextPollQuestionButton=true;

    }
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    $scope.nextPollQuestion = function(){
        if (pollQuestions.length>0){
            $scope.pollQuestion = pollQuestions.pop();
            initShowPollFields();
            if(pollQuestions.length===0){
                $scope.showPollFields.showNextPollQuestionButton=false;
            }
        }
    };

    $http.get('/api/pollQuestions')
        .success(function(data) {
            pollQuestions=shuffle(data);
            $scope.nextPollQuestion();
        })
        .error(function () {
            console.log("error getting poll questions!!!!!!!!!");
        });

    $scope.dateRequestData={};
    $scope.sendDateRequest =  function(){
        $("#wedding-request-date-justin").modal("toggle");
        $http.post('/api/dateRequests',$scope.dateRequestData)
            .success(function(data) {
                $scope.dateRequestData = {}; // clear the form so our user is ready to enter another
                showWeddingToast("Justin thanks you for the date request! He will be so happy");
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };


    $scope.musicRequestData={};
    $scope.sendMusicRequest = function(){
        $("#wedding-request-music").modal("toggle");
        $http.post('/api/musicRequests',$scope.musicRequestData)
            .success(function(data) {
                $scope.musicRequestData = {}; // clear the form so our user is ready to enter another
                //$scope.musicRequests = data;
                showWeddingToast("Thank you for the Music request!")
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

    };



    function showWeddingToast(msg){
        var delayIn = 1000;
        var delayOut =3000;
        $scope.weddingToast=msg;
        $(".wedding-toast").hide().fadeIn(delayIn).fadeOut(delayOut);
    }
};

/*var ngTestTodo = angular.module('ngTestTodo',[]);

ngTestTodo.controller('mainController',mainController);

function mainController($scope, $http) {
    $scope.formData = {};


}*/
