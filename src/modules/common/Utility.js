import angular from 'angular';

const mod = angular.module('ngFormLib.common.utility', []);

export default mod.name;

mod.constant('ngFormLibDateUtil', {
  convertDate: function(dateStr, newSep) {
    // Converts a date between dd/mm/yyyy and yyyy-mm-dd
    if (!dateStr || !newSep || !(newSep === '/' || newSep === '-')) {
      return dateStr;
    }

    // Choose a separator string that is the 'opposite' of the desired separator
    let oldSep = newSep === '/' ? '-' : '/';
    let parts = dateStr.split(oldSep);

    // if we get a dodgy date OR you tried to convert a date that was already in the correct format, return the input
    if (isNaN(parts.join('')) || parts.length !== 3) {
      return dateStr;
    }

    // Swap the year and day parts around
    return parts[2] + newSep + parts[1] + newSep + parts[0];
  },
  formatDay: function(dayOrDate, month, year) {
    let dd = dayOrDate;
    let mm = month;
    let yyyy = year;

    if (dayOrDate.getUTCDay) {
      dd = dayOrDate.getDate();
      mm = dayOrDate.getMonth() + 1;// January is 0!`
      yyyy = dayOrDate.getFullYear();
    }
    return (dd < 10 ? '0' + dd : dd) + '/' + (mm < 10 ? '0' + mm : mm) + '/' + yyyy;
  },
  dateAdd: function(dateStr, numDays) {
    // Return a modified date in ISO format
    let myDate = this.getDate(dateStr);

    myDate.setDate(myDate.getDate() + numDays);

    return this.formatDay(myDate);
  },
  getToday: function(optionalDate) {
    return this.formatDay(optionalDate || new Date());
  },
  isISODate: function(dateStr) {
    return typeof dateStr === 'string' && dateStr.indexOf('-') > 0;
  },
  getDate: function(dateStr) {
    if (!this.isISODate(dateStr)) {
      dateStr = this.convertDate(dateStr, '-');
    }
    return new Date(dateStr);
  },
  monthsBetween: function(date1, date2) {
    return date2.getMonth() - date1.getMonth() + (12 * (date2.getFullYear() - date1.getFullYear()));  // eslint-disable-line no-extra-parens
  },
});


mod.constant('ngFormLibStringUtil', (function() {
  let trimRegExp = /^\s+|\s+$/g;

  return {
    trim: function(text) {
      if (typeof text === 'string') {
        return text.replace(trimRegExp, '');
      }
      return text;
    },
  };
})());


mod.constant('ngFormLibNumberUtil', (function() {
  let isDigitsRegExp = /^\d+$/;

  return {
    isDigits: function(text) {
      return isDigitsRegExp.test(text);
    },
  };
})());


mod.constant('ngFormLibObjectUtil', {
  getUniqueId: function() {
    return ('' + (new Date()).getTime() + Math.random()).replace(/\./, '');
  },
  toArray: function(obj) {
    let arr = [];

    for (let i in obj) {
      if (obj.hasOwnProperty(i)) {
        arr[arr.length] = {key: i, value: obj[i]};
      }
    }
    arr.sort(function compare(a, b) {
      return a.key < b.key;
    });
    return arr;
  },
});
