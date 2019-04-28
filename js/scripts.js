var stocks = {};
var sock = new WebSocket("ws://stocks.mnet.website");
sock.onmessage = function(event) {
    var data = JSON.parse(event.data);
    data.forEach(([name,price],index) => {
        var date = new Date();
        // Check if key exists in array
        if(!(stocks.hasOwnProperty(`${name}`))) {
            //Create wrapper row
            stocks[`${name}`] = `${price}`
            var tableRow = document.createElement("tr");
            tableRow.id = `${name}`;
            tableRow.className = 'dataContainer'

            // Push name of stock to td
            // defaultBorder class adds a default border color to the td
            var ticker = document.createElement("td");
            ticker.innerHTML = `${name}`;
            ticker.id = `ticker_${name}`;
            ticker.className = 'data defaultBorder';

            // Push stock value to td
            var data = document.createElement("td");
            data.innerHTML = Math.round(stocks[name] * 100) / 100;
            data.id = `data_${name}`;
            data.className = 'data';

            // Push last updated time to td
            var time = document.createElement("td");
            time.id = `time_${name}`;
            time.innerHTML = formatDate(date);
            time.className = 'data dataTime';
            
            // Append values to wrapper tableRow
            document.getElementById('liveData').appendChild(tableRow)
            document.getElementById(`${name}`).appendChild(ticker);
            document.getElementById(`${name}`).appendChild(data);
            document.getElementById(`${name}`).appendChild(time);
        }
        else {
            // Check if stock price has decreased
            if(stocks[name] < price) {
                document.getElementById(`data_${name}`).classList = 'data less';
                document.getElementById(`ticker_${name}`).classList = 'data lessBorder';
            }
            // Check if stock price has increased
            else if (stocks[name] > price) {
                document.getElementById(`data_${name}`).classList = 'data more';
                document.getElementById(`ticker_${name}`).classList = 'data moreBorder';
            }
            // Remove other classes if stock price is consistant
            else {
                document.getElementById(`data_${name}`).classList = 'data';
                document.getElementById(`ticker_${name}`).classList = 'data defaultBorder';
            }

            // Limit decimal values to 2 places
            stocks[name] = Math.round(price * 100) / 100;

            // Get last updated time of stock price
            var timeDiff = getTimeDifference(new Date(), date);
            document.getElementById(`data_${name}`).innerHTML = Math.round(stocks[name] * 100) / 100;
            document.getElementById(`time_${name}`).innerHTML = timeDiff;
        }
    });                               
}
// Function to format date eg: 28 April 2019 8:21 PM
function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var dateString = day + ' ' + monthNames[monthIndex] + ' ' + year;
    var dateTime = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    var combinedDate = dateString + ' ' + dateTime;
    return combinedDate;
}
// Function to get the time when stock was last updated
function getTimeDifference(newDate,oldDate) {
    // ms stores difference between dates in Milliseconds
    var ms = newDate.getTime() - oldDate.getTime();
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;


    if (s < 60) {
        return " A few seconds ago"
    } else if (m < 60) {
        return m + " minutes ago"
    } else if (h < 24) {
        return h + " hours ago"
    } else {
        return d + " days ago";
    }

}

// Function to toggle sidebar menu for mobile
function toggleMenu() {
    if(document.getElementById('sidebar').classList.contains('closed')){
        document.getElementById('sidebar').classList = 'sidebar';
    }else {
        document.getElementById('sidebar').classList = 'sidebar closed';
    }
    if(document.getElementById('body').classList.contains('disableScroll')){
        document.getElementById('body').classList = '';
    }else {
        document.getElementById('body').classList = 'disableScroll';
    }                
}