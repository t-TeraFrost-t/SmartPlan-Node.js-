$(document).ready(function(){
    $(".add-element").hide();
    $("#note-modal-creation").hide();
    $("#task-modal-creation").hide();
    $("#note-modal-main").hide();
    $("#task-modal-main").hide();
    $("#task-modal-creation").draggable();
    $("#note-modal-creation").draggable();
    $("#task-modal-main").draggable();
    $("#note-modal-main").draggable();
    $(".plus").hover(function(){
        $(".add-element").show();
        $(".plus-icon").hide();
        $(".plus").addClass("note");
    }
    , function(){
            $(".add-element").hide();
            $(".plus-icon").show();
            $(".plus").removeClass("note");
    });
    $("#show-task-modal").click(() => {
        $("#task-modal-creation").show();
        $("#task-modal-creation").find(".close").click( () => {
            $("#task-modal-creation").hide();
        })
    })
    $("#show-note-modal").click(() => {
        $("#note-modal-creation").show();
        $("#note-modal-creation").find(".close").click( () => {
            $("#note-modal-creation").hide();
        })
    })
    $("#button-task").click(()=>{
        $.post(`/task/${$("#task-modal-creation").find("#title").val()}/${$("#task-modal-creation").find("#text").val()}/${$("#task-modal-creation").find('#importance').val()}/${$("#task-modal-creation").find('#start-date').val()}/${$("#task-modal-creation").find('#end-date').val()}`,(data)=>{
            console.log("data");
            window.location.reload();
        });
    });
    $("#button-note").click(()=>{
        console.log($("#note-modal-creation").find("#time").val());
        $.post(`/note/${$("#note-modal-creation").find("#title").val()}/${$("#note-modal-creation").find("#text").val()}/${$("#note-modal-creation").find('#importance').val()}/${$("#note-modal-creation").find('#link').val()}/${$("#note-modal-creation").find('#time').val()}`,(data)=>{
            console.log("data");
            window.location.reload();
        });
    });
    $(".el").click(()=>{
        
        let id = $(event.currentTarget).attr("id");
        $("#task-modal-main").show();
        $.get(`/task/${id}`,(data)=>{
            console.log(data[0].id);
            $('#task-modal-main').find('.close').click(()=>{
                $("#task-modal-main").hide();
            });
            $("#notes-list").empty();
            $('#task-modal-main').find('#id-task').text(data[0].id);
            $('#task-modal-main').find('#title').val(data[0].name);
            $('#task-modal-main').find('#text').val(data[0].text_task);
            $('#task-modal-main').find('#importance').val(data[0].id_importance);
            $('#task-modal-main').find('#start-date').val(data[0].start_date.substring(0,10));
            $('#task-modal-main').find('#end-date').val(data[0].end_date.substring(0,10));
            if(data[1]!=null){
                
                data[1].forEach(element => {
                    console.log('h');
                    let d = new Date(element.start_date);
                    $("#notes-list").append(`<p id='${element.id}'>${element.name} ${d.toLocaleString()}</p>`)
                });
            }
            
           
        });
        
        
    });
    $('#button-update-task').click(()=>{
        $.ajax({
            url: `/task/${$("#task-modal-main").find("#id-task").text()}/${$("#task-modal-main").find("#title").val()}/${$("#task-modal-main").find("#text").val()}/${$("#task-modal-main").find('#importance').val()}/${$("#task-modal-main").find('#start-date').val()}/${$("#task-modal-main").find('#end-date').val()}`,
            type: 'PUT',
            success: (data)=>{
                console.log("data");
                window.location.reload();
            }
        });
    });
    $('#button-delete-task').click(()=>{
        $.ajax({
            url: `/task/${$("#task-modal-main").find("#id-task").text()}`,
            type: 'DELETE',
            success: (data)=>{
                console.log("data");
                window.location.reload();
            }
        });
    });
    $('#button-update-note').click(()=>{
        $.ajax({
            url: `/note/${$("#note-modal-main").find("#id-note").text()}/${$("#note-modal-main").find("#title").val()}/${$("#note-modal-main").find("#text").val()}/${$("#note-modal-main").find('#importance').val()}/${$("#note-modal-main").find('#link').val()}/${$("#note-modal-main").find('#time').val()}`,
            type: 'PUT',
            success: (data)=>{
                console.log("data");
                window.location.reload();
            }
        });
    });
    $('#button-delete-note').click(()=>{
        $.ajax({
            url: `/note/${$("#note-modal-main").find("#id-note").text()}`,
            type: 'DELETE',
            success: (data)=>{
                console.log("data");
                window.location.reload();
            }
        });
    });
    $('#notes-list').on('click','p',()=>{
        let id = $(event.currentTarget).html().toString().match(/\d+/d)[0];
        modalNote(id);
    });
    $(".note , li").click(()=>{
        let id = $(event.currentTarget).attr("id");
        modalNote(id);
    });
    function modalNote(id){
        $("#note-modal-main").show();
        $.get(`/note/${id}`,(data)=>{
            console.log(data);
            $('#note-modal-main').find('.close').click(()=>{

                $("#note-modal-main").hide();
            });
            $('#note-modal-main').find('#id-note').text(data[0].id);
            $('#note-modal-main').find('#title').val(data[0].name);
            $('#note-modal-main').find('#text').val(data[0].text_note);
            $('#note-modal-main').find('#importance').val(data[0].id_importance);
            $('#note-modal-main').find('#time').val(data[0].start_date.substring(0,16));
            $('#note-modal-main').find('#link').val(data[0].id_task === null ? -1 : data[0].id_task);    
           
        });
    };
    
  });