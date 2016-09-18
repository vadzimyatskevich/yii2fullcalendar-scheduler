/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* http://stackoverflow.com/questions/9600295/automatically-change-text-color-to-assure-readability */
    function randomColor() {
//        var color;
//        color = Math.floor(Math.random() * 0x1000000); // integer between 0x0 and 0xFFFFFF
//        color = color.toString(16); // convert to hex
//        color = ("000000" + color).slice(-6); // pad with leading zeros
//        color = "#" + color; // prepend #
//        return color;
        return '#A9F5BC';
    }
    
$(document).ready(function() {

    $('#calendar').fullCalendar({
        height: 'auto',
        resourceAreaWidth:'10%',
        weekNumbers: true,
        weekNumberCalculation: "ISO",
        scrollTime: '00:00', // undo default 6am scrollTime
        nowIndicator: true,
        customButtons: {
        allcountryButton: {
            text: 'Все страны',
            click: function() {
//              
document.cookie = "allc=1";

location.reload();
          }
        },
        foreigncountryButton: {
            text: 'моя страна',
            click: function() {
//              
document.cookie = "allc=0";

location.reload();
          }
        },
    },
        header: {
                left: 'today prevYear,prev,next,nextYear allcountryButton,foreigncountryButton',
                center: 'title',
                right: 'timelineDays,timelineMonth,timelineYear'
        },
        views: {
            timelineDays: {
                type: 'timeline',
                duration: { days: 14 },
                slotLabelInterval: { days:1 }
            },
        },
        defaultView: 'timelineMonth',
        resourceLabelText: 'Техники',
        resourceGroupField: 'region',
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
            
            // select on resource not allowed
            if (resource.id ==='BY' ||resource.id ==='LT' || resource.id ==='LV'){
                return;
            }
                var popcontent = prompt('Event Title:');
                var eventData;
                if (popcontent) {
                    ecolor = randomColor();
                    // Create an event object and copy at least the start date and the title from event
                    $.ajax({
                        url: '/lnt-timetracker/event-select',
//                        url: '/lnt-timetracker/event-drop',
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
                            $('#calendar').fullCalendar( 'refetchEvents' ); //
                        },
                        error:function ( jqXHR, textStatus, errorThrown ) {
                        }
                    });


                }
                $('#calendar').fullCalendar('unselect');
        },
        resources: {
            url: '/lnt-timetracker/resources',
//            url: '/lnt-timetracker/resources',
            type: 'GET',
            async: false,
        },
        eventSources: [

            // your event source
            {
                url: '/lnt-timetracker/orders',
//                url: '/lnt-timetracker/orders',
                type: 'GET',
                error: function( jqXHR, textStatus, errorThrown) {
                    alert(jqXHR+textStatus+errorThrown);
                }
            },
            {
                url: '/lnt-timetracker/events',
//                url: '/lnt-timetracker/events',
                type: 'GET',
                error: function( jqXHR, textStatus, errorThrown) {
                    alert(jqXHR+textStatus+errorThrown);
                }
            }

            // any other sources...

        ],
        resourceRender: function(resourceObj, labelTds, bodyTds) {
        },
        eventClick: function(event, jsEvent, view) {
            $( '.modal-content' ).load( '/lnt-timetracker/event-click', {id: event.id},function( response, status, xhr ) {
                if (status == 'success') {
                    $('#timetrackerModal').modal('show').draggable({
                        handle: ".modal-header"
                    });
                }
            });
            return;
        },
        eventResize: function(event, delta, revertFunc) {
            $.ajax({
                url: '/lnt-timetracker/event-drop-resize',
//                url: '/lnt-timetracker/event-resize-move',
                type: 'get',
                data: {
                    eventId : event.id,
                    start: event.start.format("YYYY-MM-DD HH:mm:ss"),
                    end: event.end.format("YYYY-MM-DD HH:mm:ss"),
                    resourceId: event.resourceId
//                    delta: delta,
                },
                success: function ( data, textStatus, jqXHR ) {
                },
                error:function ( jqXHR, textStatus, errorThrown ) {
                    revertFunc();
                }
            });
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
            // revert event droped on region row
            if (event.resourceId ==='bel' || event.resourceId ==='balt'){
                revertFunc();
                return;
            }
            // planned event drop (marked with "event" in id field)
            if (event.id.search('event') !== -1 ){
                $.ajax({
                    url: '/lnt-timetracker/event-drop-resize',
//                    url: '/lnt-timetracker/event-resize-move',
                    type: 'get',
                    data: {
                        eventId : event.id,
                        start: event.start.format("YYYY-MM-DD HH:mm:ss"),
                        end: event.end.format("YYYY-MM-DD HH:mm:ss"),
                        resourceId: event.resourceId
                    },
                    success: function ( data, textStatus, jqXHR ) {
                    },
                    error:function ( jqXHR, textStatus, errorThrown ) {
                        revertFunc();
                    }
                });
                return;
            }
            // random event color
            var ecolor = randomColor();
            // Create an event object and copy at least the start date and the title from event
            $.ajax({
                url: '/lnt-timetracker/event-select',
//                url: '/lnt-timetracker/event-drop',
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
                    color: ecolor
                },
                success: function ( data, textStatus, jqXHR ) {
                    $('#calendar').fullCalendar( 'refetchEvents' ); //
                    
                },
                error:function ( jqXHR, textStatus, errorThrown ) {
                }
            });

             // Revert the changes in parent event. To move it back to original position
             event.color = 'LightGray',
             revertFunc();
        }
    });
    

});

$('#timetrackerModal').on('shown.bs.modal', function() {
    console.log("modal shown");
    $("#event_delete").click(eventDelete);
    $("#event_edit").unbind("click").click(eventEdit);
});
function eventSave (){
    console.log('eventSave() run');
        var form = $('#dv44v34rv4');
//        // return false if form still have some validation errors
        if (form.find('.has-error').length) 
        {
            console.log('has errors');
            return false;
        }
        console.log('has no errors');
        console.log('action: ' + form.attr('action'));
        // submit form
        $.ajax({
            url    : form.attr('action'),
            type   : 'post',
            data   : form.serialize(),
            success: function (response) 
            {
                console.log('success post');
                $('#calendar').fullCalendar( 'refetchEvents' ); //
                $('#timetrackerModal').modal('hide');
            },
            error  : function () 
            {
                console.log('internal server error');
            }
        });
        return false;
}
    
function eventEdit (){
    var edit_id = $("#event_edit").attr( "data-event-id" );
    $( '.modal-content' ).load( '/lnt-timetracker/event-edit&'+$.param({id: edit_id}),function( response, status, xhr ) {
        if (status == 'success') {
            console.log('eventEdit success');
            // add listener to new button
            $("#event_save").unbind("click").click(eventSave);
        }
    });
}
    
function eventDelete(){
    console.log('id: '+$("#event_delete").attr( "data-event-id" ));
    var confirm = prompt("Type yes to delete", "no");
    if (confirm == 'yes') {
        $.ajax({
            url: '/lnt-timetracker/event-delete',
            type: 'get',
            data: {
                id : $("#event_delete").attr( "data-event-id" )
            },
            success: function ( data, textStatus, jqXHR ) {
                $('#timetrackerModal').modal('hide');
                $('#calendar').fullCalendar( 'refetchEvents' ); //
            },
            error:function ( jqXHR, textStatus, errorThrown ) {
                console.log("failed");
            }
        });
    }
}
    
$(document).ajaxSuccess(function() {
//  alert("An individual AJAX call has completed successfully");
  $( ".fc-time-area.fc-widget-header .fc-scroller" ).css( "margin-bottom","0" );
});
    
$('.fc-timelineWeek-button').click(function(){
    $( ".fc-time-area.fc-widget-header .fc-scroller" ).css( "margin-bottom","0" );
});
$('.fc-timelineFourDay-button').click(function(){
    $( ".fc-time-area.fc-widget-header .fc-scroller" ).css( "margin-bottom","0" );
});
$('.fc-timelineMonth-button').click(function(){
    $( ".fc-time-area.fc-widget-header .fc-scroller" ).css( "margin-bottom","0" );
});
$('.fc-timelineYear-button').click(function(){
    $( ".fc-time-area.fc-widget-header .fc-scroller" ).css( "margin-bottom","0" );
});
$( "td" ).bind( "change", function() {
    $( ".fc-time-area.fc-widget-header .fc-scroller" ).css( "margin-bottom","0" );
});

$(".manufactureBy").on("change",function(){
    if($(this).is(":checked")) {
    //             console.log("id="+$(this).val());
        $.ajax({
            url: '/lnt-timetracker/resources',
            type: 'GET',
            data: {boxx: $(this).val()},
            success:function(r){
                // succcess call
                console.log('ok'); 
            }
        })
    //
    }
});

