var url = 'https://www.google.com/maps/@36.0946565,139.115957,3a,90y,26.06h,95.05t/',
    API_KEY = 'AIzaSyAw8O3Is67Nzb5eXbbe2_-XVwvKNQ4efvM',
    streetViewService;

$('#streetview-url').on('input', function (event) {
    var url = $(event.target).val();
    $('#iframe-code').val('');
    $('#iframe-code-legacy').val('');
    getStreetViewData(getPanoParamsObject(url));
});

/**
 * Create an object with assigned parameters.
 * The pitch parameter needs to be from -90 to 90 degrees
 * but comes with 1-179 so we need to make subtraction.
 */
function getPanoParamsObject(url) {
    var params = parseUrlForParams(url);
    return {
        latitude: params[0],
        longitude: params[1],
        fov: params[3],
        heading: params[4],
        pitch: params[5] - 90
    };
}

/**
 * Parse given Street View url and extract pano parameters.
 * Returns array of parameters (lat, long, fov, heading, pitch).
 */
function parseUrlForParams(url) {
    var anchor = document.createElement('a');
    anchor.href = url;
    var path = anchor.pathname;
    var segment = path.substring(path.indexOf('@') + 1, path.lastIndexOf('/'));
    return segment.replace(/([A-z])/g, '').split(',').map(Number);
}

/**
 * Create iframe code for Street View window preview using our api key.
 * @param panoObject with panorama parameters
 * @returns string
 */
function createIframeForPreview(panoObject) {
    return '<iframe ' +
        'width="600" ' +
        'height="400" ' +
        'frameborder="0" style="border:0" ' +
        'src="https://www.google.com/maps/embed/v1/streetview?' +
        'key=' + API_KEY +
        '&location=' + panoObject.latitude + ',' + panoObject.longitude +
        '&pano=' + panoObject.id +
        '&heading=' + panoObject.heading +
        '&pitch=' + panoObject.pitch +
        '&fov=' + panoObject.fov +
        '" allowfullscreen>' +
        '</iframe>';
}

/**
 * Create iframe code for pasting it in output textarea block, replacing our api key with stub.
 * @param iframeCode which to process for replacing
 * @returns {string} iframe without API Key
 */
function createIframeForOutput(iframeCode) {
    return iframeCode.replace(API_KEY, 'YOUR_API_KEY');
}

/**
 * Create iframe in legacy format. Not guaranteed to work in future.
 * @param panoObject
 * @returns {string} iframe with values
 */
function createLegacyIframe(panoObject) {
    return '<iframe ' +
        'width="600"' +
        'height="400"' +
        'frameborder="0"' +
        'style="border: 0"' +
        'src="https://maps.google.com/maps?layer=c&amp;panoid=' + panoObject.id +
        '&amp;ie=UTF8&amp;source=embed&amp;output=svembed&amp;' +
        'cbp=13%2C' + panoObject.heading + '%2C%2C0%2C' + -(panoObject.pitch) + '">' +
        '</iframe>';
}

function initMap() {
    streetViewService = new google.maps.StreetViewService();
    getStreetViewData(getPanoParamsObject(url));
}

/**
 * Extract panorama data such as ID from the given lat/long.
 * @param panoObject
 */
function getStreetViewData(panoObject) {
    var location = {lat: panoObject.latitude, lng: panoObject.longitude};
    streetViewService.getPanorama({location: location, radius: 15}, function (data, status) {
        if (status === google.maps.StreetViewStatus.OK) {
            panoObject.id = data.location.pano;
            var panoIframeCode = createIframeForPreview(panoObject);
            $('#street-view-frame').html(panoIframeCode);
            $('#iframe-code-legacy').val(createLegacyIframe(panoObject));
            $('#iframe-code').val(createIframeForOutput(panoIframeCode));
        } else {
            console.error('Street View data not found for this location.');
            $('#iframe-code').val('Street View not found');
        }
    });
}
