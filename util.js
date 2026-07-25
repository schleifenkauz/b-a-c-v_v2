function interpolate(samples, t) {
    if (t <= samples[0].t) return samples[0].value;
    if (t >= samples[samples.length - 1].t)
        return samples[samples.length - 1].value;

    for (let i = 0; i < samples.length - 1; i++) {
        let a = samples[i];
        let b = samples[i + 1];

        if (t >= a.t && t <= b.t) {
            let u = (t - a.t) / (b.t - a.t);
            return lerp(a.value, b.value, u);
        }
    }
}
