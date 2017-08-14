    var edit = false;
    var idx;
    var emptySeguro = {
        nombre: "",
        telefono: "",
        rnc: ""
    }

    $("#limpiar").click(function() {
        clear();
    })

    function clear() {
        $("#newSeguro").deserialize(emptySeguro);
    }

    function editar(id) {
        clear();
        $.ajax({
            type: 'GET',
            url: 'http://34.210.252.187/datamed/index.php?action=getSeguro&id=' + id,
            dataType: 'json',
            success: function(data) {
                $("#newSeguro").deserialize(data[0]);
                console.log(data);
            },
            error: function(data) {
                console.log(data);
            }
        })
        $("#newSeguroModal").modal();
        edit = true;
        idx = id;
    }

    function del(id) {
        swal({
            title: 'Estas seguro?',
            text: 'Si eliminas el seguro no podras recuperar sus datos!',
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
                    action: "deleteSeguro",
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
        $("#newSeguro").submit();
        if ($("#newSeguro").validate().errorList.length == 1) {
            var seguro = getObject("#newSeguro");
            seguro.action = (edit) ? 'updateSeguro' : 'registerSeguro';
            seguro.id = idx;
            $.ajax("http://34.210.252.187/datamed/index.php", {
                data: seguro,
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
                    $("#newSeguroModal").modal('hide');
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
        $("#newSeguro").validate();
        $.ajax({
            type: 'GET',
            url: 'http://34.210.252.187/datamed/index.php?action=getSeguros',
            dataType: 'json',
            success: function(allData) {
                for (var id in allData) {
                    var s = allData[id];
                    $("#segurosTbl").append('' +
                        '<tr id="tr' + s.id + '">' +
                        '<td>' + s.nombre + '</td>' +
                        '<td>' + s.telefono + '</td>' +
                        '<td>' + s.rnc + '</td>' +
                        '<td><a href="#" onclick="editar(\'' + s.id + '\')" class="btn btn-simple btn-warning btn-icon edit"><i class="ti-pencil-alt"></i></a>' +
                        '<a href="#" onclick="del(\'' + s.id + '\')" class="btn btn-rotate btn-simple btn-danger btn-icon remove"><i class="ti-close"></i></a>' +
                        '</td></tr>')
                }
                $("#segurosTable").dataTable();
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