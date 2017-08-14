    var edit = false;
    var idx;
    var emptyHospital = {
        nombre: "",
        direccion: "",
        latlng: ""
    }

    $("#limpiar").click(function() {
        clear();
    })

    function clear() {
        $("#newHospital").deserialize(emptyHospital);
    }

    function editar(id) {
        clear();
        $.ajax({
            type: 'GET',
            url: 'http://34.210.252.187/datamed/index.php?action=getHospital&id=' + id,
            dataType: 'json',
            success: function(data) {
                $("#newHospital").deserialize(data[0]);
                console.log(data);
            },
            error: function(data) {
                console.log(data);
            }
        })
        $("#newHospitalModal").modal();
        edit = true;
        idx = id;
    }

    function del(id) {
        swal({
            title: 'Estas seguro?',
            text: 'Si eliminas el hospital no podras recuperar sus datos!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminalo!',
            cancelButtonText: 'No, calncelar',
            confirmButtonClass: "btn btn-success btn-fill",
            cancelButtonClass: "btn btn-danger btn-fill",
            buttonsStyling: false
        }).then(function() {
            $.ajax("http://34.210.252.187/datamed/index.php", {
                data: {
                    action: "deleteHospital",
                    id: id
                },
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                success: function(msg, status, jqXHR) {
                    var men = JSON.parse(msg);
                    swal({
                        title: 'Eliminado!',
                        text: men.error || men.exito,
                        type: 'success',
                        confirmButtonClass: "btn btn-success btn-fill",
                        buttonsStyling: false
                    })
                    var tr = "#tr" + id;
                    $(tr).remove();
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
        $("#newHospital").submit();
        if ($("#newHospital").validate().errorList.length == 1) {
            var hospital = getObject("#newHospital");
            hospital.action = (edit) ? 'updateHospital' : 'registerHospital';
            hospital.id = idx;
            $.ajax("http://34.210.252.187/datamed/index.php", {
                data: hospital,
                type: "post",
                contentType: "application/x-www-form-urlencoded",
                success: function() {
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
                    $("#newHospitalModal").modal('hide');
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
        $("#newHospital").validate();
        $.ajax({
            type: 'GET',
            url: 'http://34.210.252.187/datamed/index.php?action=getHospitales',
            dataType: 'json',
            success: function(allData) {
                for (var id in allData) {
                    var h = allData[id];
                    $("#hospitalsTbl").append('' +
                        '<tr id="tr' + h.id + '">' +
                        '<td>' + h.nombre + '</td>' +
                        '<td>' + h.direccion + '</td>' +
                        '<td>' + h.latlng + '</td>' +
                        '<td><a href="#" onclick="editar(\'' + h.id + '\')" class="btn btn-simple btn-warning btn-icon edit"><i class="ti-pencil-alt"></i></a>' +
                        '<a href="#" onclick="del(\'' + h.id + '\')" class="btn btn-rotate btn-simple btn-danger btn-icon remove"><i class="ti-close"></i></a>' +
                        '</td></tr>')
                }
                $("#hospitalsTable").dataTable({
                    "pagingType": "full_numbers",
                    "lengthMenu": [
                        [10, 25, 50, -1],
                        [10, 25, 50, "All"]
                    ],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Buscar hospital",
                    }
                });
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