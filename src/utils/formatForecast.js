export function formatForecast(list) {
  const daily = {};

  list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];

    if (!daily[date]) {
      daily[date] = {
        temps: [],
        min: item.main.temp_min,
        max: item.main.temp_max,
        icon: item.weather[0].icon,
        main: item.weather[0].main,
      };
    }

    daily[date].temps.push(item.main.temp);
    daily[date].min = Math.min(daily[date].min, item.main.temp_min);
    daily[date].max = Math.max(daily[date].max, item.main.temp_max);
  });

  return Object.entries(daily).map(([date, d]) => ({
    date,
    temp: (
      d.temps.reduce((a, b) => a + b, 0) / d.temps.length
    ).toFixed(1),
    temp_min: Math.round(d.min),
    temp_max: Math.round(d.max),
    icon: d.icon,
    main: d.main,
  }));
}