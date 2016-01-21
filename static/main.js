$(document).ready(function () {
    google.maps.event.addDomListener(window, 'load', initialize);

    var panoParamsObj = null,
        testUrl = 'https://www.google.com/maps/@41.1385,-124.163335,3a,90y,292.61h,85.43t/data=!3m8!1e1!3m6!1s-KgDp6PbEdMc%2FVcfKospshpI%2FAAAAAAAACcc%2FpYJLwgd4tXk!2e4!3e11!6s%2F%2Flh5.googleusercontent.com%2F-KgDp6PbEdMc%2FVcfKospshpI%2FAAAAAAAACcc%2FpYJLwgd4tXk%2Fw203-h100-p-k-no%2F!7i8192!8i4096!6m1!1e1';

    $('#check').click(function () {
        var inputValue = $('#url').val();
        if (isUrlValid(inputValue)) {
            update(inputValue);
        }
    });

    $("#url").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#check").click();
        }
    });

    function initialize() {
        google.maps.streetViewViewer = 'photosphere';
        update(testUrl);
    }

    function update(url) {
        var panorama = getStreetViewPanoramaObj(url);

        panorama.addListener('pano_changed', function () {
            panoParamsObj['pano'] = panorama.getPano();
            panoParamsObj['lat'] = Number(panorama.getPosition().lat()).toFixed(6);
            panoParamsObj['lng'] = Number(panorama.getPosition().lng()).toFixed(6);
            updateCodePreview();
        });

        panorama.addListener('pov_changed', function () {
            panoParamsObj['heading'] = Number(panorama.getPov().heading).toFixed(2);
            panoParamsObj['pitch'] = Number(panorama.getPov().pitch).toFixed(2);
            panoParamsObj['zoom'] = Number(panorama.getPov().zoom).toFixed(2);
            updateCodePreview();
        });
    }

    function getStreetViewPanoramaObj(url) {
        panoParamsObj = getParams(url);
        return new google.maps.StreetViewPanorama(
            document.getElementById('pano'), {
                pano: panoParamsObj['pano'],
                position: {lat: panoParamsObj['lat'], lng: panoParamsObj['lng']},
                pov: {
                    heading: panoParamsObj['heading'],
                    pitch: panoParamsObj['pitch'],
                    zoom: panoParamsObj['zoom']
                }
            });
    }

    function getParams(url) {
        var anchor = document.createElement('a');
        anchor.href = url;
        var path = anchor.pathname;
        var segment = path.substring(path.indexOf('@') + 1, path.lastIndexOf('/'));
        var paramsArray = segment.replace(/([A-z])/g, '').split(',').map(Number);
        var pitch = paramsArray.length == 6 ? paramsArray[5] - 90 : 0.0;
        var zoom = getZoomFromFov(paramsArray[3]);

        return {
            pano: getPanoId(url),
            lat: paramsArray[0],
            lng: paramsArray[1],
            zoom: zoom,
            heading: paramsArray[4],
            pitch: pitch
        };
    }

    function getPanoId(url) {
        var dataIndex = url.indexOf('/data=');
        var from = url.indexOf('-', dataIndex);
        var id = url.substring(from, url.indexOf('!', from));
        return 'F:' + id.replace(new RegExp('%2F', 'g'), '/');
    }

    function getZoomFromFov(fov) {
        return Number((Math.log(180 / fov) / Math.log(2) - 1).toFixed(2));
    }

    function isUrlValid(url) {
        var errorDiv = $('#error');
        if (url == '') {
            errorDiv.text('Please enter an URL');
            errorDiv.show();
            return false;
        } else {
            var params = getParams(url);
            if (params['pano'].length != 50) {
                errorDiv.text('The URL is not valid');
                errorDiv.show();
                return false;
            }
        }
        errorDiv.hide();
        return true;
    }

    function updateCodePreview() {
        function formatHtml(s) {
            return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        document.getElementById("out").innerHTML = formatHtml(getResultString(panoParamsObj));
        Prism.highlightAll();
    }

    function getResultString() {
        return '<html>\n' +
            '<head>\n' +
            '  <script src="http://maps.google.com/maps/api/js"><\/script>\n' +
            '  <script type="text/javascript">\n' +
            '    google.maps.event.addDomListener(window, \'load\', initialize);\n' +
            '    function initialize() {\n' +
            '      google.maps.streetViewViewer = \'photosphere\';\n' +
            '      var panorama = new google.maps.StreetViewPanorama(\n' +
            '        document.getElementById(\'pano\'), {\n' +
            '          pano: \'' + panoParamsObj['pano'] + '\',\n' +
            '          position: {lat: ' + panoParamsObj['lat'] + ', lng: ' + panoParamsObj['lng'] + '},\n' +
            '          pov: {heading: ' + panoParamsObj['heading'] + ', pitch: ' + panoParamsObj['pitch'] + ', zoom: ' + panoParamsObj['zoom'] + '}\n' +
            '      });\n' +
            '    }\n' +
            '  <\/script>\n' +
            '<\/head>\n' +
            '<body>\n' +
            '  <div id="pano" style="width: 100%; height: 100%;"></div>\n' +
            '<\/body>\n' +
            '<\/html>';
    }
});
