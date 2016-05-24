// http://stackoverflow.com/a/12487454/5435443
function getOrdinal(n) {
  if ((parseFloat(n) == parseInt(n)) && ! isNaN(n)) {
    const s = [ "th","st","nd","rd" ];
    const v = n % 100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  }
  return n;
}

export default getOrdinal;
