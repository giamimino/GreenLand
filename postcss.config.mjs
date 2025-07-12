import mediaMinMax from 'postcss-media-minmax'

const config = {
  plugins: [
    mediaMinMax,
    '@tailwindcss/postcss',
  ],
};

export default config;
