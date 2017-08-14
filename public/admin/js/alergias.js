var edit = false;
var idx;
var emptyAlergia = {
    nombre: "",
    descripcion: ""
}

$("#limpiar").click(function() {
    clear();
})

function clear() {
    $("#newAlergia").deserialize(emptyAlergia);
}

function editar(id) {
    clear();
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getAlergia&id=' + id,
        dataType: 'json',
        success: function(data) {
            $("#newAlergia").deserialize(data[0]);
            console.log(data);
        },
        error: function(data) {
            console.log(data);
        }
    })
    $("#newAlergiaModal").modal();
    edit = true;
    idx = id;
}

function del(id) {
    console.log(id);
    swal({
        title: 'Estas seguro?',
        text: 'Si eliminas la alergia no podras recuperar sus datos!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, eliminala!',
        cancelButtonText: 'No, calncelar',
        confirmButtonClass: "btn btn-success btn-fill",
        cancelButtonClass: "btn btn-danger btn-fill",
        buttonsStyling: false
    }).then(function() {
        $.ajax("http://34.210.252.187/datamed/index.php", {
            data: {
                action: "deleteAlergia",
                id: id
            },
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            success: function(msg, status, jqXHR) {
                msg = JSON.parse(msg);
                if (msg.error == undefined) {
                    $.notify({
                        icon: "fa fa-check",
                        message: msg.exito
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
                }
            }
        });
    }, function(dismiss) {
        // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
        if (dismiss === 'cancel') {
            swal({
                title: 'Cancelado',
                text: 'La acción fue cancelada, no se realizó ningun cambio',
                type: 'error',
                confirmButtonClass: "btn btn-info btn-fill",
                buttonsStyling: false
            })
        }
    })

}

function save() {
    $("#newAlergia").submit();
    if ($("#newAlergia").validate().errorList.length == 1) {
        var alergia = getObject("#newAlergia");
        alergia.action = (edit) ? 'updateAlergia' : 'registerAlergia';
        alergia.id = idx;
        $.ajax("http://34.210.252.187/datamed/index.php", {
            data: alergia,
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
                if (edit == false) {
                    load(alergia);
                }
                $("#newAlergiaModal").modal('hide');
                clear();
            },
            error: function(error) {
                console.log(error);
                $.notify({
                    icon: "fa fa-close",
                    message: "Algo salió mal"
                }, {
                    type: type[4],
                    timer: 4000,
                    placement: {
                        from: 'top',
                        align: 'right'
                    }
                });
            }
        });
        edit = false;

    }
}

$("document").ready(function() {
    $("#newAlergia").validate();
    $.ajax({
        type: 'GET',
        url: 'http://34.210.252.187/datamed/index.php?action=getAlergias',
        dataType: 'json',
        success: function(allData) {
            for (var id in allData) {
                var a = allData[id];
                load(a);
            }
            $("#alergiasTable").dataTable();
        },
        error: function(error) {
            consolle.log(error);
            $.notify({
                icon: "fa fa-close",
                message: "Algo salió mal"
            }, {
                type: type[4],
                timer: 4000,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }
    });
})

function load(a) {
    $("#alergiasTbl").append('' +
        '<tr id="tr' + a.id + '">' +
        '<td>' + a.nombre + '</td>' +
        '<td>' + a.descripcion + '</td>' +
        '<td><a href="#" onclick="editar(\'' + a.id + '\')" class="btn btn-simple btn-warning btn-icon edit"><i class="ti-pencil-alt"></i></a>' +
        '<a href="#" onclick="del(\'' + a.id + '\')" class="btn btn-rotate btn-simple btn-danger btn-icon remove"><i class="ti-close"></i></a>' +
        '</td></tr>')
}