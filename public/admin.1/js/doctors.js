var idx;

var emptyDoctor = {
    id: "",
    apellido: "",
    cedula: "",
    clave: "",
    correo: "",
    movil: "",
    nombre: "",
    telefono: "",
    usuario: ""
}

function info(id) {
    if ($("#infoDoctor") != undefined) {
        $("#infoDoctor").remove();
    }
    console.log(id);
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getMedico&id=' + id,
        dataType: 'json',
        success: function(medico) {
            if (medico == false) {
                $.ajax({
                    type: 'GET',
                    url: 'http://34.210.252.187/datamed/index.php?action=getParamedico&id=' + id,
                    dataType: 'json',
                    success: function(medico) {
                        var med = medico[0];
                        med.cargo = 'Paramedico';
                        var hosp;
                        $.ajax({
                            type: 'GET',
                            url: 'http://34.210.252.187/datamed/index.php?action=getHospital&id=' + med.hospital_id,
                            dataType: 'json',
                            success: function(hospital) {
                                hosp = hospital[0];
                                loadInfo(med, hosp);
                                $("#infoDoctor").modal();
                            }
                        })
                    }
                })
            } else {
                var med = medico[0];
                med.cargo = 'Medico';
                var hosp;
                $.ajax({
                    type: 'GET',
                    url: 'http://34.210.252.187/datamed/index.php?action=getHospital&id=' + med.hospital_id,
                    dataType: 'json',
                    success: function(hospital) {
                        hosp = hospital[0];
                        loadInfo(med, hosp);
                        $("#infoDoctor").modal();
                    }
                })
            }
        }
    })
}

function loadInfo(med, hosp) {
    var modal = '<div class="modal fade" id="infoDoctor" role="dialog">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-body">' +
        '<div class="card card-user">' +
        '<div class="image"><img src=assets/img/background.jpg " alt="..."/></div>' +
        '<div class="card-content"><div class="author"><img class="avatar border-white" src="assets/img/faces/face-1.jpg" alt="..."/>' +
        '<h4 class="card-title">' + med.nombre + ' ' + med.apellido + '<br /><a href="#"><small>' + med.correo + '</small></a></h4>' +
        '</div><p class="description text-center">' +
        'Cargo : ' + med.cargo + '</p><p class="description text-center"> ' +
        'Hospital : ' + hosp.nombre + '</p> ' +
        '</div><hr><div class="text-center"><div class="row"><div class="col-md-3 col-md-offset-1">' +
        '<h5>' + med.movil + '<br /><small>Movil</small></h5></div><div class="col-md-4"><h5>' + med.cedula + '<br /><small>Cedula</small></h5>' +
        '</div><div class="col-md-3"><h5>' + med.telefono + '<br /><small>Telefono</small></h5></div></div></div></div></div></div></div>';
    $('body').append(modal);
}

$("#limpiar").click(function() {
    clear();
})

function clear() {
    $("#newDoctor").deserialize(emptyDoctor);
}

function editar(id) {
    clear();
    console.log(id);
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getMedico&id=' + id,
        dataType: 'json',
        success: function(data) {
            if (data == false) {
                $.ajax({
                    type: 'GET',
                    url: 'http://34.210.252.187/datamed/index.php?action=getParamedico&id=' + id,
                    dataType: 'json',
                    success: function(data) {
                        $("#editDoctor").deserialize(data[0]);
                    }
                })
            } else {
                $("#editDoctor").deserialize(data[0]);
            }
        },
        error: function(data) {
            console.log(data);
        }
    })
    $("#editDoctorModal").modal();
    idx = id;
}

function del(id) {
    swal({
        title: 'Estas seguro?',
        text: 'Si eliminas el doctor vas no podras recuperar sus datos!',
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
            action: "deleteMedico"
        }
        console.log(data);
        $.ajax("http://34.210.252.187/datamed/index.php", {
            data: data,
            type: "post",
            contentType: "application/x-www-form-urlencoded",
            success: function(message) {
                var men = JSON.parse(message);
                if (men.error == undefined) {
                    $.notify({
                        icon: "fa fa-check",
                        message: men.exito
                    }, {
                        type: type[2],
                        timer: 4000,
                        placement: {
                            from: 'top',
                            align: 'right'
                        }
                    });
                    var tr = "#tr" + id;
                    $(tr).remove();
                } else {
                    $.notify({
                        icon: "fa fa-close",
                        message: men.error
                    }, {
                        type: type[4],
                        timer: 4000,
                        placement: {
                            from: 'top',
                            align: 'right'
                        }
                    });
                }

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
    $("#newDoctor").submit();
    if ($("#newDoctor").validate().errorList.length == 1) {
        var doctor = getObject("#newDoctor");
        doctor.action = "registerMedico";
        console.log(doctor);
        $.ajax("http://34.210.252.187/datamed/index.php", {
            data: doctor,
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
                $("#newDoctorModal").modal("hide");
                load(doctor);
                console.log(message);
            },
            error: function(message) {
                console.log(message);
            }
        });

    }
}

function saveEdit() {
    $("#editDoctor").submit();
    if ($("#editDoctor").validate().errorList.length == 1) {
        var doctor = getObject("#editDoctor");
        doctor.action = "updateMedico";
        doctor.id = idx;
        $.ajax("http://34.210.252.187/datamed/index.php", {
            data: doctor,
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
                $("#editDoctorModal").modal("hide");
            },
            error: function(message) {
                console.log(message);
            }
        });

    }

}

$("document").ready(function() {

    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getMedicos',
        dataType: 'json',
        success: function(allData) {
            for (var id in allData) {
                var d = allData[id];
                load(d);
            }
        },
        error: function(msg, status, jqXHR) {
            console.log(msg);
        }
    });
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getParamedicos',
        dataType: 'json',
        success: function(allData) {
            for (var id in allData) {
                var d = allData[id];
                load(d);
            }
            $("#doctorsTable").dataTable({
                "pagingType": "full_numbers",
                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Buscar doctor",
                }
            });
        },
        error: function(msg, status, jqXHR) {
            console.log(msg);
        }
    });

    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getHospitales',
        dataType: 'json',
        success: function(hospitales) {
            for (var id in hospitales) {
                var hospital = hospitales[id];
                $("#hospital").append('<option value="' + hospital.id + '">' + hospital.nombre + '</option>');
                $("#editHospital").append('<option value="' + hospital.id + '">' + hospital.nombre + '</option>');
            }
        }
    })
    $("#editDoctor").validate();
    $("#newDoctor").validate();

})

function load(d) {
    var cargo = (d.rol == 1) ? 'Medico' : 'Paramedico';
    $("#doctorsTbl").append('' +
        '<tr id="tr' + d.id + '">' +
        '<td>' + d.nombre + '</td>' +
        '<td>' + d.apellido + '</td>' +
        '<td>' + cargo + '</td>' +
        '<td>' + d.cedula + '</td>' +
        '<td>' + d.correo + '</td>' +
        '<td>' + d.telefono + '</td>' +
        '<td>' + d.movil + '</td>' +
        '<td><a href="#" onclick="info(\'' + d.id + '\')" class="btn btn-simple btn-info btn-icon info"><i class="ti ti-info"></i></a>' +
        '<a href="#" onclick="editar(\'' + d.id + '\')" class="btn btn-simple btn-warning btn-icon edit"><i class="ti-pencil-alt"></i></a>' +
        '<a href="#" onclick="del(\'' + d.id + '\')" class="btn btn-rotate btn-simple btn-danger btn-icon remove"><i class="ti-close"></i></a>' +
        '</td></tr>')
}