flightsResult = {
  dates: [],

  updateDatesRange: function(date){
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var todayM = moment(today);
    var dateM = moment(date)
    var datesI = null;
    if (dateM.diff(todayM, 'days') > 2) {
      datesI = moment.twix(moment(dateM).subtract(2, 'days'), moment(dateM).add(2, 'days')).iterate('days');
    } else {
      datesI = moment.twix(todayM, moment(dateM).add(2, 'days')).iterate('days');
    }
    this.dates = [];
    while(datesI.hasNext()){
      this.dates.push(datesI.next().toDate());
    }
  },

  showDateTabs: function(date, $container){
    this.updateDatesRange(date);
    var $tabs = $('<ul></ul>').addClass('nav nav-tabs nav-justified').attr('id', 'tabs').attr('data-tabs', 'tabs');
    var $tabsContent = $('<div></div>').attr('id', 'tabsContent').addClass('tab-content');
    this.dates.forEach(function(tDate){
      var dateLabel = tDate.toISOString().slice(0, 10);
      var $li = $('<li></li>').append($('<a></a>').attr('href', '#' + dateLabel).attr('data-toggle', 'tab').text(dateLabel));

      var $pane = $('<div></div>').addClass('tab-pane').attr('id', dateLabel).text('Searching flights..');

      if (dateLabel == date){
        $li.addClass('active');
        $pane.addClass('active');
      }
      $tabs.append($li);
      $tabsContent.append($pane);
    });
    $container.html('').append($tabs).append($tabsContent);
  },
  // TODO: Add more orders and filters
  // sort = {field: 'field', dir: -1 or 1}
  setTabContent: function(date, flights, sort){
    var $tabsContent = $('#' + date);
    $tabsContent.html('');
    var $panel = $('<div class="panel panel-default"></div>');
    var $table = $('<table></table>').addClass('table');
    $panel.append($table);
    $table.append($('<thead class="thead-default"><tr><th>Airline</th><th>Dep. airport</th><th>Dest. airport</th><th>Dep. time</th><th>Price</th></tr></thead>'));
    var $tbody = $('<tbody></tbody>');
    $table.append($tbody);
    if (sort){
      flights.sort(function(a, b){
        var field = sort.field;
        var dir = sort.dir;
        if (field in a && field in b) {
          return a[field] < b[field] ? -1 : (a[field] == b[field] ? 0 : 1);
        } else {
          return 0;
        }
      });
    }
    flights.forEach(function(flight){
      var $tr = $('<tr></tr>')
        .append($('<td></td>').text(flight.airline.name))
        .append($('<td></td>').text(flight.start.airportName + ' (' + flight.start.airportCode + ')'))
        .append($('<td></td>').text(flight.finish.airportName + ' (' + flight.finish.airportCode + ')'))
        .append($('<td></td>').text(flight.start.dateTime.slice(11, 16)))
        .append($('<td></td>').text('$' + flight.price));
      $tbody.append($tr);
    });
    $tabsContent.append($panel);
  }
}