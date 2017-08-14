var idx;
var edit = false;
var emptyPatient = {
    id: "",
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    direccion: "",
    telefono: "",
    movil: "",
    fecha_nacimiento: "",
    sexo: "",
    sangre: "",
    medico_id: "",
    seguro_id: ""
}

function info(id) {
    if ($("#infoPatient") != undefined) {
        $("#infoPatient").remove();
    }

    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getPaciente&id=' + id,
        dataType: 'json',
        success: function(paciente) {
            var pac = paciente[0];
            var med;
            $.ajax({
                type: 'GET',
                url: 'http://34.210.252.187/datamed/index.php?action=getMedico&id=' + pac.medico_id,
                dataType: 'json',
                success: function(medico) {
                    med = medico[0];
                    var modal = '<div class="modal fade" id="infoPaciente" role="dialog">' +
                        '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                        '<div class="modal-body">' +
                        '<div class="card card-user">' +
                        '<div class="image"><img src=assets/img/background.jpg " alt="..."/></div>' +
                        '<div class="card-content"><div class="author"><img class="avatar border-white" src="assets/img/faces/face-1.jpg" alt="..."/>' +
                        '<h4 class="card-title">' + pac.nombre + ' ' + pac.apellido + '<br /><a href="#"><small>' + pac.correo + '</small></a></h4>' +
                        '</div><p class="description text-center">' +
                        'Medico : ' + med.nombre + '</p> ' +
                        '</div><hr><div class="text-center"><div class="row"><div class="col-md-3 col-md-offset-1">' +
                        '<h5>' + pac.movil + '<br /><small>Movil</small></h5></div><div class="col-md-4"><h5>' + pac.cedula + '<br /><small>Cedula</small></h5>' +
                        '</div><div class="col-md-3"><h5>' + pac.telefono + '<br /><small>Telefono</small></h5></div></div></div></div></div></div></div>';
                    $('body').append(modal);

                    $("#infoPaciente").modal();
                }
            })
        }
    })
}

$("#limpiar").click(function() {
    clear();
})

function clear() {
    $("#newDoctor").deserialize(emptyPatient);
}

function editar(id) {
    clear();
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getPaciente&id=' + id,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            $("#newPatient").deserialize(data[0]);
        },
        error: function(data) {
            console.log(data);
        }
    })
    $("#newPatientModal").modal();
    edit = true;
    idx = id;
}

function del(id) {
    swal({
        title: 'Estas seguro?',
        text: 'Si eliminas el paciente vas no podras recuperar sus datos!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminalo!',
        cancelButtonText: 'No, calncelar',
        confirmButtonClass: "btn btn-success btn-fill",
        cancelButtonClass: "btn btn-danger btn-fill",
        buttonsStyling: false
    }).then(function() {
        data = {
            id: id,
            action: "deletePaciente"
        }
        console.log(data);
        $.ajax("http://34.210.252.187/datamed/index.php", {
            data: data,
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            success: function(message) {
                var men = JSON.parse(message);
                var msg = {};
                if (men.error == undefined) {
                    msg = {
                        title: 'Hecho',
                        text: men.exito,
                        type: 'success',
                        confirmButtonClass: "btn btn-success btn-fill",
                        buttonsStyling: false
                    };
                } else {
                    msg = {
                        title: 'Error',
                        text: men.error,
                        type: 'error',
                        confirmButtonClass: "btn btn-success btn-fill",
                        buttonsStyling: false
                    };
                }
                swal(msg);
                var tr = "#tr" + id;
                $(tr).remove();
            }
        });

    }, function(dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === 'cancel') {
            swal({
                title: 'Cancelado',
                text: 'La accion fue cancelada, no se realizó ningun cambio',
                type: 'error',
                confirmButtonClass: "btn btn-info btn-fill",
                buttonsStyling: false
            })
        }
    })

}


function save() {
    $("#newPatient").submit();
    if ($("#newPatient").validate().errorList.length == 1) {
        var patient = getObject("#newPatient");
        patient.action = (edit) ? "updatePaciente" : "registerPaciente";
        patient.id = idx;
        console.log(patient);
        debugger;
        $.ajax("http://34.210.252.187/datamed/index.php", {
            data: patient,
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            success: function(message) {
                $.notify({
                    icon: "fa fa-check",
                    message: "La operación fué realizada con exito"
                }, {
                    type: type[2],
                    timer: 4000,
                    placement: {
                        from: 'top',
                        align: 'right'
                    }
                });
                clear();
                $("#newPatientModal").modal("hide");
                edit = false;
                load(patient);
            },
            error: function(message) {
                console.log(message);
            }
        });

    }

}

$("document").ready(function() {
    $("#newPatient").validate()
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getPacientes',
        dataType: 'json',
        success: function(allData) {
            for (var id in allData) {
                var p = allData[id];
                load(p);
            }
            $("#patientsTable").dataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Buscar paciente",
                }
            });
        },
        error: function(msg, status, jqXHR) {
            console.log(msg);
        }
    });


    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getMedicos',
        dataType: 'json',
        success: function(medicos) {
            for (var id in medicos) {
                var medico = medicos[id];
                if (medico.rol == 1)
                    $("#medico").append('<option value="' + medico.id + '">' + medico.nombre + '</option>');
            }
        }
    })
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getSangres',
        dataType: 'json',
        success: function(sangres) {
            for (var id in sangres) {
                var sangre = sangres[id];
                $("#sangre").append('<option>' + sangre.enumlabel + '</option>');
            }
        }
    })
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getSeguros',
        dataType: 'json',
        success: function(seguros) {
            for (var id in seguros) {
                var seguro = seguros[id];
                $("#seguro").append('<option value="' + seguro.id + '">' + seguro.nombre + '</option>');
            }
        }
    })

    $('.datepicker').datetimepicker({
        format: 'MM/DD/YYYY', //use this format if you want the 12hours timpiecker with AM/PM toggle
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });
})

function load(p) {
    $("#patientsTbl").append('' +
        '<tr id="tr' + p.id + '">' +
        '<td>' + p.nombre + ' ' + p.apellido + '</td>' +
        '<td>' + p.cedula + '</td>' +
        '<td>' + p.correo + '</td>' +
        '<td>' + p.telefono + '</td>' +
        '<td>' + p.movil + '</td>' +
        '<td>' + p.sexo + '</td>' +
        '<td>' + p.sangre + '</td>' +
        '<td><a href="#" onclick="info(\'' + p.id + '\')" class="btn btn-simple btn-info btn-icon info"><i class="ti ti-info"></i></a>' +
        '<a href="#" onclick="editar(\'' + p.id + '\')" class="btn btn-simple btn-warning btn-icon edit"><i class="ti-pencil-alt"></i></a>' +
        '<a href="#" onclick="del(\'' + p.id + '\')" class="btn btn-rotate btn-simple btn-danger btn-icon remove"><i class="ti-close"></i></a>' +
        '</td></tr>')
}