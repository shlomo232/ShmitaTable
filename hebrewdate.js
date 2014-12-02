/*         JavaScript functions for positional astronomy                  by John Walker  --  September, MIM
                       http://www.fourmilab.ch/                This program is in the public domain.*/

//  Frequently-used constants
var
    J2000             = 2451545.0,              // Julian day of J2000 epoch
    JulianCentury     = 36525.0,                // Days in Julian century
    JulianMillennium  = (JulianCentury * 10),   // Days in Julian millennium
    AstronomicalUnit  = 149597870.0,            // Astronomical unit in kilometres
    TropicalYear      = 365.24219878;           // Mean solar tropical year

/*  ASTOR  --  Arc-seconds to radians.  */
function astor(a) {
    return a * (Math.PI / (180.0 * 3600.0));
}

//  Radians to/from degrees
function dtr(d) { return (d * Math.PI) / 180.0; }
function rtd(r) { return (r * 180.0) / Math.PI; }

function fixangle(a) {//  Range reduce angle in degrees
        return a - 360.0 * (Math.floor(a / 360.0));
}

function fixangr(a) { //  Range reduce angle in radians
        return a - (2 * Math.PI) * (Math.floor(a / (2 * Math.PI)));
}

// Functions in degrees
function dsin(d) {    return Math.sin(dtr(d)); }
function dcos(d) {    return Math.cos(dtr(d)); }

function mod(a, b) {
    return a - (b * Math.floor(a / b));// Modulus function which works for non-integers
}
function amod(a, b) {//  Modulus function which returns numerator if modulus is zero
    return mod(a - 1, b) + 1;
}

/*  JHMS  --  Convert Julian time to hour, minutes, and seconds, returned as a three-element array.  */
function jhms(j) {
    var ij;
    j += 0.5;                 /* Astronomical to civil */
    ij = (j - Math.floor(j)) * 86400.0;
    return new Array(
                     Math.floor(ij / 3600),
                     Math.floor((ij / 60) % 60),
                     Math.floor(ij % 60));
}

//  JWDAY  --  Calculate day of week from Julian day
var Weekdays = new Array( "Sunday", "Monday", "Tuesday", "Wednesday",
                          "Thursday", "Friday", "Saturday" );
var HWeekdays = new Array( "Yom Rishon", "Yom Sheni", "Yom Shlishi", "Yom Revi'i", 
                          "Yom Hamishi", "Yom Shishi", "Shabbat" );

function jwday(j) {
    return mod(Math.floor((j + 1.5)), 7);
}

/*  OBLIQEQ  --  Calculate the obliquity of the ecliptic for a given Julian date.  This uses Laskar's tenth-degree polynomial fit (J. Laskar, Astronomy and Astrophysics, Vol. 157, page 68 [1986]) which is accurate to within 0.01 arc second between AD 1000 and AD 3000, and within a few seconds of arc for +/-10000 years around AD 2000.  If we're outside the range in which this fit is valid (deep time) we simply return the J2000 value of the obliquity, which happens to be almost precisely the mean.  */
var oterms = new Array (
        -4680.93,           -1.55,         1999.25,          -51.38,
         -249.67,          -39.05,            7.12,           27.87,
            5.79,            2.45 );

function obliqeq(jd) {
    var eps, u, v, i;
    v = u = (jd - J2000) / (JulianCentury * 100);
    eps = 23 + (26 / 60.0) + (21.448 / 3600.0);
    if (Math.abs(u) < 1.0) {
        for (i = 0; i < 10; i++) {
            eps += (oterms[i] / 3600.0) * v;
            v *= u;
        }
    }
    return eps;
}

/* Periodic terms for nutation in longiude (delta \Psi) and obliquity (delta \Epsilon) as given in table 21.A of Meeus, "Astronomical Algorithms", first edition. */
var nutArgMult = new Array(
     0,  0,  0,  0,  1,
    -2,  0,  0,  2,  2,
     0,  0,  0,  2,  2,
     0,  0,  0,  0,  2,
     0,  1,  0,  0,  0,
     0,  0,  1,  0,  0,
    -2,  1,  0,  2,  2,
     0,  0,  0,  2,  1,
     0,  0,  1,  2,  2,
    -2, -1,  0,  2,  2,
    -2,  0,  1,  0,  0,
    -2,  0,  0,  2,  1,
     0,  0, -1,  2,  2,
     2,  0,  0,  0,  0,
     0,  0,  1,  0,  1,
     2,  0, -1,  2,  2,
     0,  0, -1,  0,  1,
     0,  0,  1,  2,  1,
    -2,  0,  2,  0,  0,
     0,  0, -2,  2,  1,
     2,  0,  0,  2,  2,
     0,  0,  2,  2,  2,
     0,  0,  2,  0,  0,
    -2,  0,  1,  2,  2,
     0,  0,  0,  2,  0,
    -2,  0,  0,  2,  0,
     0,  0, -1,  2,  1,
     0,  2,  0,  0,  0,
     2,  0, -1,  0,  1,
    -2,  2,  0,  2,  2,
     0,  1,  0,  0,  1,
    -2,  0,  1,  0,  1,
     0, -1,  0,  0,  1,
     0,  0,  2, -2,  0,
     2,  0, -1,  2,  1,
     2,  0,  1,  2,  2,
     0,  1,  0,  2,  2,
    -2,  1,  1,  0,  0,
     0, -1,  0,  2,  2,
     2,  0,  0,  2,  1,
     2,  0,  1,  0,  0,
    -2,  0,  2,  2,  2,
    -2,  0,  1,  2,  1,
     2,  0, -2,  0,  1,
     2,  0,  0,  0,  1,
     0, -1,  1,  0,  0,
    -2, -1,  0,  2,  1,
    -2,  0,  0,  0,  1,
     0,  0,  2,  2,  1,
    -2,  0,  2,  0,  1,
    -2,  1,  0,  2,  1,
     0,  0,  1, -2,  0,
    -1,  0,  1,  0,  0,
    -2,  1,  0,  0,  0,
     1,  0,  0,  0,  0,
     0,  0,  1,  2,  0,
    -1, -1,  1,  0,  0,
     0,  1,  1,  0,  0,
     0, -1,  1,  2,  2,
     2, -1, -1,  2,  2,
     0,  0, -2,  2,  2,
     0,  0,  3,  2,  2,
     2, -1,  0,  2,  2 );

var nutArgCoeff = new Array(
    -171996,   -1742,   92095,      89,          /*  0,  0,  0,  0,  1 */
     -13187,     -16,    5736,     -31,          /* -2,  0,  0,  2,  2 */
      -2274,      -2,     977,      -5,          /*  0,  0,  0,  2,  2 */
       2062,       2,    -895,       5,          /*  0,  0,  0,  0,  2 */
       1426,     -34,      54,      -1,          /*  0,  1,  0,  0,  0 */
        712,       1,      -7,       0,          /*  0,  0,  1,  0,  0 */
       -517,      12,     224,      -6,          /* -2,  1,  0,  2,  2 */
       -386,      -4,     200,       0,          /*  0,  0,  0,  2,  1 */
       -301,       0,     129,      -1,          /*  0,  0,  1,  2,  2 */
        217,      -5,     -95,       3,          /* -2, -1,  0,  2,  2 */
       -158,       0,       0,       0,          /* -2,  0,  1,  0,  0 */
        129,       1,     -70,       0,          /* -2,  0,  0,  2,  1 */
        123,       0,     -53,       0,          /*  0,  0, -1,  2,  2 */
         63,       0,       0,       0,          /*  2,  0,  0,  0,  0 */
         63,       1,     -33,       0,          /*  0,  0,  1,  0,  1 */
        -59,       0,      26,       0,          /*  2,  0, -1,  2,  2 */
        -58,      -1,      32,       0,          /*  0,  0, -1,  0,  1 */
        -51,       0,      27,       0,          /*  0,  0,  1,  2,  1 */
         48,       0,       0,       0,          /* -2,  0,  2,  0,  0 */
         46,       0,     -24,       0,          /*  0,  0, -2,  2,  1 */
        -38,       0,      16,       0,          /*  2,  0,  0,  2,  2 */
        -31,       0,      13,       0,          /*  0,  0,  2,  2,  2 */
         29,       0,       0,       0,          /*  0,  0,  2,  0,  0 */
         29,       0,     -12,       0,          /* -2,  0,  1,  2,  2 */
         26,       0,       0,       0,          /*  0,  0,  0,  2,  0 */
        -22,       0,       0,       0,          /* -2,  0,  0,  2,  0 */
         21,       0,     -10,       0,          /*  0,  0, -1,  2,  1 */
         17,      -1,       0,       0,          /*  0,  2,  0,  0,  0 */
         16,       0,      -8,       0,          /*  2,  0, -1,  0,  1 */
        -16,       1,       7,       0,          /* -2,  2,  0,  2,  2 */
        -15,       0,       9,       0,          /*  0,  1,  0,  0,  1 */
        -13,       0,       7,       0,          /* -2,  0,  1,  0,  1 */
        -12,       0,       6,       0,          /*  0, -1,  0,  0,  1 */
         11,       0,       0,       0,          /*  0,  0,  2, -2,  0 */
        -10,       0,       5,       0,          /*  2,  0, -1,  2,  1 */
         -8,       0,       3,       0,          /*  2,  0,  1,  2,  2 */
          7,       0,      -3,       0,          /*  0,  1,  0,  2,  2 */
         -7,       0,       0,       0,          /* -2,  1,  1,  0,  0 */
         -7,       0,       3,       0,          /*  0, -1,  0,  2,  2 */
         -7,       0,       3,       0,          /*  2,  0,  0,  2,  1 */
          6,       0,       0,       0,          /*  2,  0,  1,  0,  0 */
          6,       0,      -3,       0,          /* -2,  0,  2,  2,  2 */
          6,       0,      -3,       0,          /* -2,  0,  1,  2,  1 */
         -6,       0,       3,       0,          /*  2,  0, -2,  0,  1 */
         -6,       0,       3,       0,          /*  2,  0,  0,  0,  1 */
          5,       0,       0,       0,          /*  0, -1,  1,  0,  0 */
         -5,       0,       3,       0,          /* -2, -1,  0,  2,  1 */
         -5,       0,       3,       0,          /* -2,  0,  0,  0,  1 */
         -5,       0,       3,       0,          /*  0,  0,  2,  2,  1 */
          4,       0,       0,       0,          /* -2,  0,  2,  0,  1 */
          4,       0,       0,       0,          /* -2,  1,  0,  2,  1 */
          4,       0,       0,       0,          /*  0,  0,  1, -2,  0 */
         -4,       0,       0,       0,          /* -1,  0,  1,  0,  0 */
         -4,       0,       0,       0,          /* -2,  1,  0,  0,  0 */
         -4,       0,       0,       0,          /*  1,  0,  0,  0,  0 */
          3,       0,       0,       0,          /*  0,  0,  1,  2,  0 */
         -3,       0,       0,       0,          /* -1, -1,  1,  0,  0 */
         -3,       0,       0,       0,          /*  0,  1,  1,  0,  0 */
         -3,       0,       0,       0,          /*  0, -1,  1,  2,  2 */
         -3,       0,       0,       0,          /*  2, -1, -1,  2,  2 */
         -3,       0,       0,       0,          /*  0,  0, -2,  2,  2 */
         -3,       0,       0,       0,          /*  0,  0,  3,  2,  2 */
         -3,       0,       0,       0  );         /*  2, -1,  0,  2,  2 */

/*  NUTATION  --  Calculate the nutation in longitude, deltaPsi, and  obliquity, deltaEpsilon for a given Julian date  jd.  Results are returned as a two element Array giving (deltaPsi, deltaEpsilon) in degrees.  */
function nutation(jd) {
    var deltaPsi, deltaEpsilon,
        i, j,
        t = (jd - 2451545.0) / 36525.0, t2, t3, to10,
        ta = new Array(),
        dp = 0, de = 0, ang;
    t3 = t * (t2 = t * t);
    /* Calculate angles.  The correspondence between the elements of our array and the terms cited in Meeus are:
       ta[0] = D  ta[0] = M  ta[2] = M'  ta[3] = F  ta[4] = \Omega  */
    ta[0] = dtr(297.850363 + 445267.11148 * t - 0.0019142 * t2 +                 t3 / 189474.0);
    ta[1] = dtr(357.52772 + 35999.05034 * t - 0.0001603 * t2 -                t3 / 300000.0);
    ta[2] = dtr(134.96298 + 477198.867398 * t + 0.0086972 * t2 +                t3 / 56250.0);
    ta[3] = dtr(93.27191 + 483202.017538 * t - 0.0036825 * t2 +                t3 / 327270);
    ta[4] = dtr(125.04452 - 1934.136261 * t + 0.0020708 * t2 +                t3 / 450000.0);
    /* Range reduce the angles in case the sine and cosine functions don't do it as accurately or quickly. */
    for (i = 0; i < 5; i++) {
        ta[i] = fixangr(ta[i]);
    }
    to10 = t / 10.0;
    for (i = 0; i < 63; i++) {
        ang = 0;
        for (j = 0; j < 5; j++) {
            if (nutArgMult[(i * 5) + j] != 0) {
                ang += nutArgMult[(i * 5) + j] * ta[j];
            }
        }
        dp += (nutArgCoeff[(i * 4) + 0] + nutArgCoeff[(i * 4) + 1] * to10) * Math.sin(ang);
        de += (nutArgCoeff[(i * 4) + 2] + nutArgCoeff[(i * 4) + 3] * to10) * Math.cos(ang);
    }
    /* Return the result, converting from ten thousandths of arc seconds to radians in the process. */
    deltaPsi = dp / (3600.0 * 10000.0);
    deltaEpsilon = de / (3600.0 * 10000.0);
    return new Array(deltaPsi, deltaEpsilon);
}

/*  ECLIPTOEQ  --  Convert celestial (ecliptical) longitude and latitude into right ascension (in degrees) and declination.  We must supply the time of the conversion in order to compensate correctly for the varying obliquity of the ecliptic over time The right ascension and declination are returned as a two-element Array in that order.  */
function ecliptoeq(jd, Lambda, Beta) {
    var eps, Ra, Dec;

    /* Obliquity of the ecliptic. */
    eps = dtr(obliqeq(jd));
  //  log += "Obliquity: " + rtd(eps) + "\n";
    Ra = rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda)) -
                        (Math.tan(dtr(Beta)) * Math.sin(eps))),
                      Math.cos(dtr(Lambda))));
  //  log += "RA = " + Ra + "\n";
    Ra = fixangle(rtd(Math.atan2((Math.cos(eps) * Math.sin(dtr(Lambda)) -
                        (Math.tan(dtr(Beta)) * Math.sin(eps))),
                      Math.cos(dtr(Lambda)))));
    Dec = rtd(Math.asin((Math.sin(eps) * Math.sin(dtr(Lambda)) * Math.cos(dtr(Beta))) +
                 (Math.sin(dtr(Beta)) * Math.cos(eps))));
    return new Array(Ra, Dec);
}

/*  DELTAT  --  Determine the difference, in seconds, between Dynamical time and Universal time.  */
/*  Table of observed Delta T values at the beginning of even numbered years from 1620 through 2002.  */
var deltaTtab = new Array(
    121, 112, 103, 95, 88, 82, 77, 72, 68, 63, 60, 56, 53, 51, 48, 46,
    44, 42, 40, 38, 35, 33, 31, 29, 26, 24, 22, 20, 18, 16, 14, 12,
    11, 10, 9, 8, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10,
    10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13,
    13, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16,
    16, 16, 15, 15, 14, 13, 13.1, 12.5, 12.2, 12, 12, 12, 12, 12, 12,
    11.9, 11.6, 11, 10.2, 9.2, 8.2, 7.1, 6.2, 5.6, 5.4, 5.3, 5.4, 5.6,
    5.9, 6.2, 6.5, 6.8, 7.1, 7.3, 7.5, 7.6, 7.7, 7.3, 6.2, 5.2, 2.7,
    1.4, -1.2, -2.8, -3.8, -4.8, -5.5, -5.3, -5.6, -5.7, -5.9, -6,
    -6.3, -6.5, -6.2, -4.7, -2.8, -0.1, 2.6, 5.3, 7.7, 10.4, 13.3, 16,
    18.2, 20.2, 21.1, 22.4, 23.5, 23.8, 24.3, 24, 23.9, 23.9, 23.7,
    24, 24.3, 25.3, 26.2, 27.3, 28.2, 29.1, 30, 30.7, 31.4, 32.2,
    33.1, 34, 35, 36.5, 38.3, 40.2, 42.2, 44.5, 46.5, 48.5, 50.5,
    52.2, 53.8, 54.9, 55.8, 56.9, 58.3, 60, 61.6, 63, 65, 66.6      );

function deltat(year){
    var dt, f, i, t;
    if ((year >= 1620) && (year <= 2000)) {
        i = Math.floor((year - 1620) / 2);
        f = ((year - 1620) / 2) - i;  /* Fractional part of year */
        dt = deltaTtab[i] + ((deltaTtab[i + 1] - deltaTtab[i]) * f);
    } else {
        t = (year - 2000) / 100;
        if (year < 948) {
            dt = 2177 + (497 * t) + (44.1 * t * t);
        } else {
            dt = 102 + (102 * t) + (25.3 * t * t);
            if ((year > 2000) && (year < 2100)) {
                dt += 0.37 * (year - 2100);
            }
        }
    }
    return dt;
}

/*  EQUINOX  --  Determine the Julian Ephemeris Day of an equinox or solstice.  The "which" argument selects the item to be computed:
                    0   March equinox
                    1   June solstice
                    2   September equinox
                    3   December solstice
*/
//  Periodic terms to obtain true time
var EquinoxpTerms = new Array(
                       485, 324.96,   1934.136,
                       203, 337.23,  32964.467,
                       199, 342.08,     20.186,
                       182,  27.85, 445267.112,
                       156,  73.14,  45036.886,
                       136, 171.52,  22518.443,
                        77, 222.54,  65928.934,
                        74, 296.72,   3034.906,
                        70, 243.58,   9037.513,
                        58, 119.81,  33718.147,
                        52, 297.17,    150.678,
                        50,  21.02,   2281.226,
                        45, 247.54,  29929.562,
                        44, 325.15,  31555.956,
                        29,  60.93,   4443.417,
                        18, 155.12,  67555.328,
                        17, 288.79,   4562.452,
                        16, 198.04,  62894.029,
                        14, 199.76,  31436.921,
                        12,  95.39,  14577.848,
                        12, 287.11,  31931.756,
                        12, 320.81,  34777.259,
                         9, 227.73,   1222.114,
                         8,  15.45,  16859.074                             );

JDE0tab1000 = new Array(
   new Array(1721139.29189, 365242.13740,  0.06134,  0.00111, -0.00071),
   new Array(1721233.25401, 365241.72562, -0.05323,  0.00907,  0.00025),
   new Array(1721325.70455, 365242.49558, -0.11677, -0.00297,  0.00074),
   new Array(1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006)                       );

JDE0tab2000 = new Array(
   new Array(2451623.80984, 365242.37404,  0.05169, -0.00411, -0.00057),
   new Array(2451716.56767, 365241.62603,  0.00325,  0.00888, -0.00030),
   new Array(2451810.21715, 365242.01767, -0.11575,  0.00337,  0.00078),
   new Array(2451900.05952, 365242.74049, -0.06223, -0.00823,  0.00032)                       );

function equinox(year, which) {
    var deltaL, i, j, JDE0, JDE, JDE0tab, S, T, W, Y;

    /*  Initialise terms for mean equinox and solstices.  We have two sets: one for years prior to 1000 and a second
        for subsequent years.  */
    if (year < 1000) {
        JDE0tab = JDE0tab1000;
        Y = year / 1000;
    } else {
        JDE0tab = JDE0tab2000;
        Y = (year - 2000) / 1000;
    }

    JDE0 =  JDE0tab[which][0] +
           (JDE0tab[which][1] * Y) +
           (JDE0tab[which][2] * Y * Y) +
           (JDE0tab[which][3] * Y * Y * Y) +
           (JDE0tab[which][4] * Y * Y * Y * Y);

    T = (JDE0 - 2451545.0) / 36525;
    W = (35999.373 * T) - 2.47;
    deltaL = 1 + (0.0334 * dcos(W)) + (0.0007 * dcos(2 * W));

    //  Sum the periodic terms for time T
    S = 0;
    for (i = j = 0; i < 24; i++) {
        S += EquinoxpTerms[j] * dcos(EquinoxpTerms[j + 1] + (EquinoxpTerms[j + 2] * T));
        j += 3;
    }
    JDE = JDE0 + ((S * 0.00001) / deltaL);
    return JDE;
}

/*  SUNPOS  --  Position of the Sun.  Please see the comments on the return statement at the end of this function which describe the array it returns.  We return intermediate values because they are useful in a variety of other contexts.  */
function sunpos(jd) {
    var T, T2, L0, M, e, C, sunLong, sunAnomaly, sunR,
        Omega, Lambda, epsilon, epsilon0, Alpha, Delta,
        AlphaApp, DeltaApp;

    T = (jd - J2000) / JulianCentury;
    T2 = T * T;
    L0 = 280.46646 + (36000.76983 * T) + (0.0003032 * T2);
    L0 = fixangle(L0);
    M = 357.52911 + (35999.05029 * T) + (-0.0001537 * T2);
    M = fixangle(M);
    e = 0.016708634 + (-0.000042037 * T) + (-0.0000001267 * T2);
    C = ((1.914602 + (-0.004817 * T) + (-0.000014 * T2)) * dsin(M)) +
        ((0.019993 - (0.000101 * T)) * dsin(2 * M)) +
        (0.000289 * dsin(3 * M));
    sunLong = L0 + C;
    sunAnomaly = M + C;
    sunR = (1.000001018 * (1 - (e * e))) / (1 + (e * dcos(sunAnomaly)));
    Omega = 125.04 - (1934.136 * T);
    Lambda = sunLong + (-0.00569) + (-0.00478 * dsin(Omega));
    epsilon0 = obliqeq(jd);
    epsilon = epsilon0 + (0.00256 * dcos(Omega));
    Alpha = rtd(Math.atan2(dcos(epsilon0) * dsin(sunLong), dcos(sunLong)));
    Alpha = fixangle(Alpha);
    Delta = rtd(Math.asin(dsin(epsilon0) * dsin(sunLong)));
    AlphaApp = rtd(Math.atan2(dcos(epsilon) * dsin(Lambda), dcos(Lambda)));
    AlphaApp = fixangle(AlphaApp);
    DeltaApp = rtd(Math.asin(dsin(epsilon) * dsin(Lambda)));

    return new Array(                 //  Angular quantities are expressed in decimal degrees
        L0,                           //  [0] Geometric mean longitude of the Sun
        M,                            //  [1] Mean anomaly of the Sun
        e,                            //  [2] Eccentricity of the Earth's orbit
        C,                            //  [3] Sun's equation of the Centre
        sunLong,                      //  [4] Sun's true longitude
        sunAnomaly,                   //  [5] Sun's true anomaly
        sunR,                         //  [6] Sun's radius vector in AU
        Lambda,                       //  [7] Sun's apparent longitude at true equinox of the date
        Alpha,                        //  [8] Sun's true right ascension
        Delta,                        //  [9] Sun's true declination
        AlphaApp,                     // [10] Sun's apparent right ascension
        DeltaApp                      // [11] Sun's apparent declination
    );
}

/*  EQUATIONOFTIME  --  Compute equation of time for a given moment. Returns the equation of time as a fraction of a day.  */

function equationOfTime(jd) {
    var alpha, deltaPsi, E, epsilon, L0, tau;
    tau = (jd - J2000) / JulianMillennium;
    L0 = 280.4664567 + (360007.6982779 * tau) +
         (0.03032028 * tau * tau) +
         ((tau * tau * tau) / 49931) +
         (-((tau * tau * tau * tau) / 15300)) +
         (-((tau * tau * tau * tau * tau) / 2000000));
    L0 = fixangle(L0);
    alpha = sunpos(jd)[10];
    deltaPsi = nutation(jd)[0];
    epsilon = obliqeq(jd) + nutation(jd)[1];
    E = L0 + (-0.0057183) + (-alpha) + (deltaPsi * dcos(epsilon));
    E = E - 20.0 * (Math.floor(E / 20.0));
    E = E / (24 * 60);
    return E;
}
/* Original Javascript engine by John Walker, Fourmilab. This program is in the public domain. */

var J0000 = 1721424.5;                // Julian date of Gregorian epoch: 0000-01-01
var J1970 = 2440587.5;                // Julian date at Unix epoch: 1970-01-01
var JMJD  = 2400000.5;                // Epoch of Modified Julian Date system
var J1900 = 2415020.5;                // Epoch (day 1) of Excel 1900 date system (PC)
var J1904 = 2416480.5;                // Epoch (day 0) of Excel 1904 date system (Mac)
var juliandayvalue=0;
var NormLeap = new Array("Normal year (365 days)", "Leap year (366 days)");

/*  WEEKDAY_BEFORE  --  Return Julian date of given weekday (0 = Sunday) in the seven days ending on jd.  */
function weekday_before(weekday, jd){
    return jd - jwday(jd - weekday);
}

/*  SEARCH_WEEKDAY  --  Determine the Julian date for: 
            weekday      Day of week desired, 0 = Sunday
            jd           Julian date to begin search
            direction    1 = next weekday, -1 = last weekday
            offset       Offset from jd to begin search
*/
function search_weekday(weekday, jd, direction, offset) {
    return weekday_before(weekday, jd + (direction * offset));
}

//  Utility weekday functions, just wrappers for search_weekday
function nearest_weekday(weekday, jd){
    return search_weekday(weekday, jd, 1, 3);
}
function next_weekday(weekday, jd){
    return search_weekday(weekday, jd, 1, 7);
}
function next_or_current_weekday(weekday, jd) {
    return search_weekday(weekday, jd, 1, 6);
}
function previous_weekday(weekday, jd) {
    return search_weekday(weekday, jd, -1, 1);
}

function previous_or_current_weekday(weekday, jd)
{return search_weekday(weekday, jd, 1, 0);
}

//  LEAP_GREGORIAN  --  Is a given year in the Gregorian calendar a leap year ?
function leap_gregorian(year) {
    return ((year % 4) == 0) &&
            (!(((year % 100) == 0) && ((year % 400) != 0)));
}

//  GREGORIAN_TO_JD  --  Determine Julian day number from Gregorian calendar date

var GREGORIAN_EPOCH = 1721425.5;

function gregorian_to_jd(year, month, day) {
    return (GREGORIAN_EPOCH - 1) +
           (365 * (year - 1)) +
           Math.floor((year - 1) / 4) +
           (-Math.floor((year - 1) / 100)) +
           Math.floor((year - 1) / 400) +
           Math.floor((((367 * month) - 362) / 12) +
           ((month <= 2) ? 0 :
                               (leap_gregorian(year) ? -1 : -2)
           ) +
           day);
}

//  JD_TO_GREGORIAN  --  Calculate Gregorian calendar date from Julian day
function jd_to_gregorian(jd) {
    var wjd, depoch, quadricent, dqc, cent, dcent, quad, dquad, yindex, year, month, day, yearday, leapadj;

    wjd = Math.floor(jd - 0.5) + 0.5;
    depoch = wjd - GREGORIAN_EPOCH;
    quadricent = Math.floor(depoch / 146097);
    dqc = mod(depoch, 146097);
    cent = Math.floor(dqc / 36524);
    dcent = mod(dqc, 36524);
    quad = Math.floor(dcent / 1461);
    dquad = mod(dcent, 1461);
    yindex = Math.floor(dquad / 365);
    year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent == 4) || (yindex == 4))) {
        year++;
    }
    yearday = wjd - gregorian_to_jd(year, 1, 1);
    leapadj = ((wjd < gregorian_to_jd(year, 3, 1)) ? 0
                                                  :
                  (leap_gregorian(year) ? 1 : 2)
              );
 month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
 day = (wjd - gregorian_to_jd(year, month, 1)) + 1;
 return new Array(year, month, day);
}

//  ISO_TO_JULIAN  --  Return Julian day of given ISO year, week, and day
function n_weeks(weekday, jd, nthweek) {
   var j = 7 * nthweek;
   if (nthweek > 0) {
        j += previous_weekday(weekday, jd);
    } else {
        j += next_weekday(weekday, jd);
    }
   return j;
}

function iso_to_julian(year, week, day) {
    return day + n_weeks(0, gregorian_to_jd(year - 1, 12, 28), week);
}

//  JD_TO_ISO  --  Return array of ISO (year, week, day) for Julian day
function jd_to_iso(jd) {
    var year, week, day;
     year = jd_to_gregorian(jd - 3)[0];
     if (jd >= iso_to_julian(year + 1, 1, 1)) { year++; }
    week = Math.floor((jd - iso_to_julian(year, 1, 1)) / 7) + 1;
    day = jwday(jd);
    if (day == 0) {
     day = 7;
    }
    return new Array(year, week, day);
}

//  ISO_DAY_TO_JULIAN  --  Return Julian day of given ISO year, and day of year
function iso_day_to_julian(year, day) {
    return (day - 1) + gregorian_to_jd(year, 1, 1);
}

//  JD_TO_ISO_DAY  --  Return array of ISO (year, day_of_year) for Julian day
function jd_to_iso_day(jd) {
    var year, day;
    year = jd_to_gregorian(jd)[0];
    day = Math.floor(jd - gregorian_to_jd(year, 1, 1)) + 1;
    return new Array(year, day);
}

/*  PAD  --  Pad a string to a given length with a given fill character.  */
function pad(str, howlong, padwith) {
    var s = str.toString();
    while (s.length < howlong) {s = padwith + s;}
    return s;
}

//  JULIAN_TO_JD  --  Determine Julian day number from Julian calendar date
var JULIAN_EPOCH = 1721423.5;
function leap_julian(year) {
    return (year % 4) == ((year > 0) ? 0 : 3);
}

function julian_to_jd(year, month, day) {
  /* Adjust negative common era years to the zero-based notation we use.  */
  if (year < 1) {year++;}

  /* Algorithm as given in Meeus, Astronomical Algorithms, Chapter 7, page 61 */
  if (month <= 2) {year--;month += 12;}
  return ((Math.floor((365.25 * (year + 4716))) +
              Math.floor((30.6001 * (month + 1))) +
              day) - 1524.5);
}

//  JD_TO_JULIAN  --  Calculate Julian calendar date from Julian day
function jd_to_julian(td) {
    var z, a, b, c, d, e, year, month, day;
    td += 0.5;
    z = Math.floor(td);
    a = z;
    b = a + 1524;
    c = Math.floor((b - 122.1) / 365.25);
    d = Math.floor(365.25 * c);
    e = Math.floor((b - d) / 30.6001);
    month = Math.floor((e < 14) ? (e - 1) : (e - 13));
    year = Math.floor((month > 2) ? (c - 4716) : (c - 4715));
    day = b - d - Math.floor(30.6001 * e);
    /*  If year is less than 1, subtract one to convert from a zero based date system to the common era system in which the year -1 (1 B.C.E) is followed by year 1 (1 C.E.).  */
    if (year < 1) {year--;}
    return new Array(year, month, day);
}

//  HEBREW_TO_JD  --  Determine Julian day from Hebrew date
var HEBREW_EPOCH = 347995.5;


function hebrew_leap(year) { //  Is a given Hebrew year a leap year ?
    return mod(((year * 7) + 1), 19) < 7;
}
function hebrew_year_months(year) {
    return hebrew_leap(year) ? 13 : 12;
}

//  Test for delay of start of new year and to avoid Sunday, Wednesday, and Friday as start of the new year.
function hebrew_delay_1(year) {
 var months, day, parts;
 months = Math.floor(((235 * year) - 234) / 19);
 parts = 12084 + (13753 * months);
 day = (months * 29) + Math.floor(parts / 25920);
 if (mod((3 * (day + 1)), 7) < 3) {day++;}
 return day;
}

//  Check for delay in start of new year due to length of adjacent years
function hebrew_delay_2(year) {
 var last, present, next;
 last = hebrew_delay_1(year - 1);
 present = hebrew_delay_1(year);
 next = hebrew_delay_1(year + 1);
 return ((next - present) == 356) ? 2 : (((present - last) == 382) ? 1 : 0);
}

//  How many days are in a Hebrew year ?
function hebrew_year_days(year) {
    return hebrew_to_jd(year + 1, 7, 1) - hebrew_to_jd(year, 7, 1);
}

//  How many days are in a given month of a given year
function hebrew_month_days(year, month) {
    //  First of all, dispose of fixed-length 29 day months
    if (month == 2 || month == 4 || month == 6 || month == 10 || month == 13) {return 29;}
    if (month == 12 && !hebrew_leap(year)) {return 29;} //  If it's not a leap year, Adar has 29 days
    if (month == 8 && !(mod(hebrew_year_days(year), 10) == 5)) {return 29;} //  If it's Heshvan, days depend on length of year
    //  Similarly, Kislev varies with the length of year
    if (month == 9 && (mod(hebrew_year_days(year), 10) == 3)) {return 29;}
    //  Nope, it's a 30 day month
    return 30;
}

//  Finally, wrap it all up into...
function hebrew_to_jd(year, month, day) {
 var jd, mon, months;
 months = hebrew_year_months(year);
 jd = HEBREW_EPOCH + hebrew_delay_1(year) +
      hebrew_delay_2(year) + day + 1;
 if (month < 7) {
        for (mon = 7; mon <= months; mon++) {            jd += hebrew_month_days(year, mon);        }
        for (mon = 1; mon < month; mon++) {            jd += hebrew_month_days(year, mon);        }
    } else {
        for (mon = 7; mon < month; mon++) {            jd += hebrew_month_days(year, mon);        }
    }
 return jd;
}

/*  JD_TO_HEBREW  --  Convert Julian date to Hebrew date
  This works by making multiple calls to the inverse function, and is this very slow.  */
function jd_to_hebrew(jd) {
    var year, month, day, i, count, first;
    jd = Math.floor(jd) + 0.5;
    count = Math.floor(((jd - HEBREW_EPOCH) * 98496.0) / 35975351.0);
    year = count - 1;
    for (i = count; jd >= hebrew_to_jd(i, 7, 1); i++) {
        year++;
    }
    first = (jd < hebrew_to_jd(year, 1, 1)) ? 7 : 1;
    month = first;
    for (i = first; jd > hebrew_to_jd(year, i, hebrew_month_days(year, i)); i++) {
        month++;
    }
    day = (jd - hebrew_to_jd(year, month, 1)) + 1;
    return new Array(year, month, day);
}

function updateFromGregorian() {
    var j, year, mon, mday, hour, min, sec, weekday, hebcal;//, julcal, hebcal, islcal, hwdindex, utime, isoweek,
  /*      may_countcal, mayhaabcal, maytzolkincal, bahcal, frrcal, indcal, isoday, xgregcal */
    year = new Number(document.gregorian.year.value);
    mon = document.gregorian.month.selectedIndex;
    mday = new Number(document.gregorian.day.value);
    if (mday>=32) {alert("Gregorian day number too high");return;}
    if (((mon==3)||(mon==5)||(mon==8)||(mon==10))&&(mday==31)) {alert("Gregorian day number too high");return;}
    hour = min = sec = 0;
//    if (nextday==true) {mday= mday+1}

    //  Update Julian day
    j = gregorian_to_jd(year, mon + 1, mday) +           ((sec + 60 * (min + 60 * hour)) / 86400.0);
    juliandayvalue = j;

    //  Update day of week in Gregorian and Hebrew boxes
    weekday = jwday(j);

    //  Update Hebrew Calendar
    hebcal = jd_to_hebrew(j);
    if (hebrew_leap(hebcal[0])) {
        document.hebrew.month.options.length = 13;
        document.hebrew.month.options[11] = new Option("Adar I");
        document.hebrew.month.options[12] = new Option("Adar II");
    } else {
        document.hebrew.month.options.length = 12;
        document.hebrew.month.options[11] = new Option("Adar");
    }
    document.hebrew.year.value = hebcal[0];
    document.hebrew.month.selectedIndex = hebcal[1] - 1;
    document.hebrew.day.value = hebcal[2];

    //  Update Gregorian serial number
    if (document.gregserial != null) {document.gregserial.day.value = j - J0000;}
}

//  calcGregorian  --  Perform calculation starting with a Gregorian date
function calcGregorian() { updateFromGregorian(); }

function calcJulian() {
    var j, date, time;
    j = new Number(juliandayvalue);
    date = jd_to_gregorian(j);
    time = jhms(j);
    document.gregorian.year.value = date[0];
    document.gregorian.month.selectedIndex = date[1] - 1;
    document.gregorian.day.value = date[2];
    updateFromGregorian();
}

//  setJulian  --  Set Julian date and update all calendars
function setJulian(j) { juliandayvalue = new Number(j);calcJulian();}

//  calcHebrew  --  Update from Hebrew calendar
function calcHebrew() { 
    if (document.hebrew.day.value>=31) {alert("Hebrew day number too high");return;}
    setJulian(hebrew_to_jd((new Number(document.hebrew.year.value)),
        document.hebrew.month.selectedIndex + 1,
        (new Number(document.hebrew.day.value))));
}

