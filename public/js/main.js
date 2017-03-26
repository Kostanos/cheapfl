$(function () {
  $('#travelDate').datepicker({
    autoclose: true,
    startDate: new Date(),
    format: {
      toDisplay: function (date, format, language) {
        if (!date) return '';
        var d = new Date(date);
        return d.toISOString().slice(0, 10);
      },
      toValue: function (date, format, language) {
        if (!date) return '';
        var d = new Date(date);
        return d.toISOString().slice(0, 10);
      }
    }
  });

  $('.location').select2({
    placeholder: "Type at least 2 letters",
    dropdownAutoWidth: false,
    width: '100%',
    ajax: {
      url: "/locations",
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          q: params.term, // search term
        };
      },
      processResults: function (data, params) {
        return {
          results: data,
        };
      },
      results: function (data) { // parse the results into the format expected by Select2.
        return {results: data};
      },
      cache: true
    },
    minimumInputLength: 2,
  });

  $('#flightsForm').validator().on('submit', function (e) {
    var formData = $(e.target).serializeArray().reduce(function(obj, item) {
      obj[item.name] = item.value;
      return obj;
    }, {})
    if (e.isDefaultPrevented()) {
      console.log('test7');
      // handle the invalid form...
    } else {
      e.preventDefault();
      flightsResult.showDateTabs($('#travelDate').val(), $('#flightsResult'));
      // We get in parallel flights for each date
      flightsResult.dates.forEach(function(date){
        var fData = {};
        var sDate = date.toISOString().slice(0, 10);
        Object.assign(fData, formData);
        fData.travelDate = sDate;
        $.ajax({
          url: '/search',
          type: 'post',
          data: fData,
          success: function(data) {
            flightsResult.setTabContent(sDate, data, {field: 'price', dir: 1});
          }
        });
      })
    }
  });
});
