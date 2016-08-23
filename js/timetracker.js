/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* http://stackoverflow.com/questions/9600295/automatically-change-text-color-to-assure-readability */
    function randomColor() {
        var color;
        color = Math.floor(Math.random() * 0x1000000); // integer between 0x0 and 0xFFFFFF
        color = color.toString(16); // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color; // prepend #
        return color;
    }
    
/* keypress register */
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
        timezone: 'UTC',
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
            console.log(start.format("YYYY-MM-DD HH:mm:ss"));
            console.log(end.format("YYYY-MM-DD HH:mm:ss"));
                var popcontent = prompt('Event Title:');
                var eventData;
                if (popcontent) {
                    ecolor = randomColor();
                        eventData = {
                                id: 'event',
                                title: popcontent,
                                popcontent: popcontent,
                                start: start,
                                end: end,
                                allDay: true,
                                resourceId: resource.id,
                                editable: true, // enable draggable events
                                droppable: true,
                                color: ecolor,
                        };
            // Create an event object and copy at least the start date and the title from event
                    $.ajax({
//                        url: '/index.php?r=lnt-timetracker/event-drop',
                        url: '/lnt-timetracker/event-drop',
                        type: 'get',
                        data: {
                            id : null,
                            orderId: null,
                            resourceId: resource.id,
                            start: start.format("YYYY-MM-DD HH:mm:ss"),
                            end: end.format("YYYY-MM-DD HH:mm:ss"),
                            delta: 0,
                            allDay: true,
                            title: popcontent,
                            popcontent: popcontent,
                            color: ecolor,
                        },
                        success: function ( data, textStatus, jqXHR ) {
                            console.log(data);
                            eventData.id = 'event_' + data.id;
                            $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
                        },
                        error:function ( jqXHR, textStatus, errorThrown ) {
                            console.log('jqXHR: '+ jqXHR);
                            console.log('textStatus: '+ textStatus);
                            console.log('errorThrown: '+ errorThrown);
                        }
                    });


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
//            url: '/index.php?r=lnt-timetracker/resources',
            url: '/lnt-timetracker/resources',
            type: 'GET'
        },
        eventSources: [

            // your event source
            {
//                url: '/index.php?r=lnt-timetracker/orders',
                url: '/lnt-timetracker/orders',
                type: 'GET',
                error: function( jqXHR, textStatus, errorThrown) {
                    alert(jqXHR+textStatus+errorThrown);
                }
            },
            {
//                url: '/index.php?r=lnt-timetracker/events',
                url: '/lnt-timetracker/events',
                type: 'GET',
                error: function( jqXHR, textStatus, errorThrown) {
                    alert(jqXHR+textStatus+errorThrown);
                }
            }

            // any other sources...

        ],
        eventClick: function(event, jsEvent, view) {
           console.log(event);
            // planned event drop (marked with "event" in id field)
            if (event.id.search('event') !== -1 ){
                var mesg = prompt('Удалить?', 'да');
                if (mesg === 'да'){
                    $.ajax({
//                        url: '/index.php?r=lnt-timetracker/event-delete',
                        url: '/lnt-timetracker/event-delete',
                        type: 'get',
                        data: {
                            id : event.id,
                        },
                        success: function ( data, textStatus, jqXHR ) {
                            console.log(data);
                            if (data === 'ok') {
                                $('#calendar').fullCalendar( 'removeEvents' , event.id );
                            }
                        },
                        error:function ( jqXHR, textStatus, errorThrown ) {
                            console.log('jqXHR: '+ jqXHR);
                            console.log('textStatus: '+ textStatus);
                            console.log('errorThrown: '+ errorThrown);
                        }
                    });
                }

                return;
            }
        },
        eventResize: function(event, delta, revertFunc) {
            console.log('eventResize');
            console.log(event.id);
            console.log('start: ' + event.start.format("YYYY-MM-DD HH:mm:ss"));
            console.log('end: ' + event.end.format("YYYY-MM-DD HH:mm:ss"));
            $.ajax({
//                        url: '/index.php?r=lnt-timetracker/event-resize-move',
                url: '/lnt-timetracker/event-resize-move',
                type: 'get',
                data: {
                    eventId : event.id,
                    start: event.start.format("YYYY-MM-DD HH:mm:ss"),
                    end: event.end.format("YYYY-MM-DD HH:mm:ss"),
                    resourceId: event.resourceId
//                    delta: delta,
                },
                success: function ( data, textStatus, jqXHR ) {
                     console.log('success');
                     console.log(data);
//                     revertFunc();
                },
                error:function ( jqXHR, textStatus, errorThrown ) {
                    console.log('error');
                    revertFunc();
                }
            });
//            alert(event.title + " end is now " + event.end.format());
//
//            if (!confirm("is this okay?")) {
//                revertFunc();
//            }
        },
        eventMouseover: function(event, element) {
            $this = $(this);
            $this.popover({ html:true,
                            title:event.title, 
                            content:event.popcontent,
                            placement:'top',
                            container: 'body',
                            trigger:'manual'
                                }).popover('show');
//            setTimeout(function() {$this.popover('hide');},3000);
        },
        eventMouseout: function(calEvent, jsEvent) {
            $this = $(this);
            $this.popover().popover('hide');
        },
        eventDrop: function( event, delta, revertFunc, jsEvent, ui, view ) {
            console.log(event);
            console.log(delta);
            console.log(view);

            // revert event droped on region row
            if (event.resourceId ==='BY' || event.resourceId ==='LT' || event.resourceId ==='LV'){
                revertFunc();
                return;
            }
            // planned event drop (marked with "event" in id field)
            if (event.id.search('event') !== -1 ){
                $.ajax({
    //                        url: '/index.php?r=lnt-timetracker/event-resize-move',
                    url: '/lnt-timetracker/event-resize-move',
                    type: 'get',
                    data: {
                        eventId : event.id,
                        start: event.start.format("YYYY-MM-DD HH:mm:ss"),
                        end: event.end.format("YYYY-MM-DD HH:mm:ss"),
                        resourceId: event.resourceId
    //                    delta: delta,
                    },
                    success: function ( data, textStatus, jqXHR ) {
                         console.log('success');
                         console.log(data);
    //                     revertFunc();
                    },
                    error:function ( jqXHR, textStatus, errorThrown ) {
                        console.log('error');
                        revertFunc();
                    }
                });
                return;
            }
            // random event color
            var ecolor = randomColor();
            // Create an event object and copy at least the start date and the title from event
            $.ajax({
//                url: '/index.php?r=lnt-timetracker/event-drop',
                url: '/lnt-timetracker/event-drop',
                type: 'get',
                data: {
                    id : event.id,
                    orderId: event.id,
                    resourceId: event.resourceId,
                    start: event.start.format("YYYY-MM-DD HH:mm:ss"),
                    end: event.end.format("YYYY-MM-DD HH:mm:ss"),
                    delta: delta._days,
                    allDay: event.allDay,
                    title: event.title,
                    popcontent: event.popcontent,
                    color: ecolor,
                },
                success: function ( data, textStatus, jqXHR ) {
                    console.log(data);
                },
                error:function ( jqXHR, textStatus, errorThrown ) {
                    console.log('jqXHR: '+ jqXHR);
                    console.log('textStatus: '+ textStatus);
                    console.log('errorThrown: '+ errorThrown);
                }
            });

                var eventClone = {
                    id : 'event_' + event.id,
                    title: '' + event.title,
                    popcontent: event.popcontent,
                    start: event.start,
                    end: event.end,
                    resourceId: event.resourceId,
                    color: ecolor,
                    textColor: 'black'
                };
             // Render new event with new event object
             $('#calendar').fullCalendar('renderEvent', eventClone, true);

             // Revert the changes in parent event. To move it back to original position
             event.color = 'LightGray'
             revertFunc();
        }
    });
});