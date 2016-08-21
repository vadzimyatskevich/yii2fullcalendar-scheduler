/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

var copyKey = false;
$(document).keydown(function (e) {
    copyKey = e.shiftKey;
}).keyup(function () {
    copyKey = false;
});

$(document).ready(function() {

    $('#calendar').fullCalendar({
//            now: '2016-05-07',
        height: 'auto',
        resourceAreaWidth:'10%',
        lang: 'ru',
        buttonText: {
            year: "Год",
            month: "Месяц",
            week: "Неделя",
            day: "День",
            list: "Повестка дня"
        },
        businessHours: {

            // days of week. an array of zero-based day of week integers (0=Sunday)
            dow: [ 1, 2, 3, 4, 5 ], // Monday - Thursday

            start: '08:00', // a start time (10am in this example)
            end: '17:00', // an end time (6pm in this example)
        },
        editable: true, // enable draggable events
//            droppable: true,
        selectable: true,
        selectHelper: true,
        select: function(start, end, jsEvent, view, resource  ) {
                var title = prompt('Event Title:');
                var eventData;
                if (title) {
                        eventData = {
                                id: 'event',
                                title: title,
                                start: start,
                                end: end,
                                allDay: true,
                                resourceId: resource.id,
                                editable: true, // enable draggable events
                                droppable: true,
                                color: getRandomColor(),
                        };
                        console.log(eventData);
                        $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                }
                $('#calendar').fullCalendar('unselect');
        },
        aspectRatio: 1.8,
        scrollTime: '00:00', // undo default 6am scrollTime
        header: {
                left: 'today prevYear,prev,next,nextYear',
                center: 'title',
                right: 'timelineWeek,timelineMonth,timelineYear'
        },
        defaultView: 'timelineMonth',
//        resourceLabelText: 'Работники',
        resourceGroupField: 'region',
        resources: {
            url: '/lnt-timetracker/resources',
            type: 'GET'
        },
        eventSources: [

            // your event source
            {
//                url: '/index.php?r=lnt-timetracker/jsoncalendar',
                url: '/lnt-timetracker/orders',
                type: 'GET',
    //            data: {
    //                custom_param1: 'something',
    //                custom_param2: 'somethingelse'
    //            },
                error: function( jqXHR, textStatus, errorThrown) {
                    alert(jqXHR+textStatus+errorThrown);
                },
                color: 'yellow',   // a non-ajax option
                textColor: 'black' // a non-ajax option
            }

            // any other sources...

        ],
        eventClick: function(event, jsEvent, view) {
           console.log(event);
        },
    //    eventRender: function (event, element) {
    //        element.popover({
    //            title: event.name,
    //            placement: 'right',
    //            content: + '<br />Start: ' + event.starts_at + '<br />End: ' + event.ends_at + '<br />Description: ' + event.description,
    //        });
    //    },
        eventMouseover: function(event, element) {
            $this = $(this);
            $this.popover({ html:true,
                            title:event.title, 
                            content:event.popcontent,
                            placement:'auto top',
                            container: 'body',
                            trigger:'hover'
                                }).popover('show');
            return false;  
        },
        eventMouseout: function(calEvent, jsEvent) {
            $this = $(this);
            $this.popover().popover('hide');
        },
        eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
            // Create an event object and copy at least the start date and the title from event
//             var eventClone = event;
            if (event.id.search('event') !== -1 ){
                return;
            }
            if (event.resourceId ==='BY' || event.resourceId ==='LT' || event.resourceId ==='LV'){
                revertFunc();
                return;
            }
                
                var eventClone = {
                    id : 'event_' + event.id,
                    title: 'Выезд ' + event.title,
                    popcontent: event.popcontent,
                    start: event.start,
                    end: event.end,
                    resourceId: event.resourceId,
                    color: getRandomColor(),
                };
             // Render new event with new event object
             $('#calendar').fullCalendar('renderEvent', eventClone, true);

             // Revert the changes in parent event. To move it back to original position
             event.color = 'LightGreen'
             revertFunc();
        }
    });
});