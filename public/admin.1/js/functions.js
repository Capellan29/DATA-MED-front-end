//Funcion para tomar los parametros que esta por get, via JS.
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function getObject(form) {
    var formData = $(form).serializeArray();
    var result = {};
    for (var i = 0; i < formData.length; ++i)
        result[formData[i].name] = formData[i].value;
    return result;
}


jQuery.fn.deserialize = function(data) {
    var f = this,
        find = function(selector) { return f.is("form") ? f.find(selector) : f.filter(selector); };

    //Set values for all form elements in the data
    jQuery.each(data, function(n, v) {
        find("[name='" + n + "']").val(v);
    })
};