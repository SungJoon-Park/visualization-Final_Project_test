import BubbleChart from './Bubble.js';

d3.csv('MoviesOnStreamingPlatforms_genre_cleaned.csv', d3.autoType).then(data => {
    let movies = data.filter(d => {
        if (d.IMDb == null) return;
        else if (0 < d.IMDb < 10 && d.Genres) {
            return d;
        }

    });

    let dataset = movies.filter(d => {
        if (d.Netflix == 1) return d;
    });
    dataset.sort((a, b) => b['IMDb'] - a['IMDb']);
    let dat = dataset.slice(0, 600);
    console.log(dataset);
    const Bubble = BubbleChart(".bubble");
    Bubble.update(dat);
});