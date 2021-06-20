$(document).ready(()=>{
    console.log("hi");
    //localStorage.removeItem('password');
    console.log(localStorage.password);
    if(localStorage.username && localStorage.username.lenght!=0 && localStorage.password && localStorage.password.lenght!=0){
        $("#email").val(localStorage.username);
        $("#password").val(localStorage.password);
    }
    //$("#email").val("aaa@abv.bg");
    //    $("#password").val("aaa");
    $("#button-log").click(()=>{
        if($("#remember-in").is(":checked")){
            localStorage.setItem('username', $('#email').val());
            localStorage.setItem('password', $('#password').val());
        }
        console.log($("#email").val());
       // console.log(`/user/${$("#email").val()}/${$("#password").val()}/`);
        $.get(`/user/${$("#email").val()}/${$("#password").val()}`,(data)=>{
            if(data == "error"){
                $('#error').show();
            }else {
                window.location.href=data;    
            }
        });
        //$.send(,()=>{});
    });
    $("#button-reg").click(()=>{
        console.log($("#email").val());
        console.log($("#pwd1").val());
        if($("#pwd1").val()===$("#pwd2").val()){
            $.post(`/user/${$("#email").val()}/${$("#pwd1").val()}`,(data)=>{
                console.log(data);
                if(data == "error"){
                    $('#error').show();
                }else {
                    window.location.href=data;    
                }
            });
        }else $('#error-pas').show();
        
        
        
    });
});