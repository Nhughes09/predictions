import requests
import json
from datetime import datetime

print("=" * 60)
print("RESOLVING W017, W018, W020")
print("Test window: March 12-19 2026")
print("=" * 60)

results = {}

# ── W017: Solar wind pressure + SR frequency ─────────
print("\nW017: Solar wind pressure March 12-19 2026")
print("Prediction: SR >=7.85 Hz when SW >5 nPa")

w017_max_pressure = None
w017_above5_hours = 0

try:
    url = ("https://cdaweb.gsfc.nasa.gov/hapi/data?"
           "id=OMNI2_H0_MRG1HR&parameters=flow_pressure"
           "&time.min=2026-03-12T00:00:00Z"
           "&time.max=2026-03-19T23:59:59Z"
           "&format=json")
    r = requests.get(url, timeout=20)
    print(f"OMNI status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        records = data.get('data', [])
        print(f"Got {len(records)} records")
        pressures = []
        for d in records:
            try:
                p = float(d[1])
                if p < 99:
                    pressures.append(p)
            except Exception:
                pass
        if pressures:
            w017_max_pressure = max(pressures)
            above5 = [p for p in pressures if p > 5.0]
            w017_above5_hours = len(above5)
            print(f"Max pressure: {w017_max_pressure:.2f} nPa")
            print(f"Hours above 5 nPa: {w017_above5_hours}")
            if above5:
                print("W017 pre-condition MET: SW exceeded 5 nPa")
                print("Still need SR freq data to confirm/falsify")
                results['W017_precondition'] = True
                results['W017_max_nPa'] = w017_max_pressure
            else:
                print("W017: SW never exceeded 5 nPa -- VOID")
                results['W017_status'] = 'VOID'
                results['W017_reason'] = 'pre-condition not met (SW never >5 nPa)'
        else:
            print("No valid pressure data returned")
            results['W017_status'] = 'UNRESOLVED'
    else:
        print(f"OMNI returned {r.status_code}")
        results['W017_status'] = 'UNRESOLVED'
except Exception as e:
    print(f"OMNI fetch failed: {e}")
    results['W017_status'] = 'UNRESOLVED'
    results['W017_error'] = str(e)

# ── W018: hmF2 ionospheric data ───────────────────────
print("\nW018: hmF2 descent >=10km after >6 nPa spike")
print("Source: lgdc.uml.edu")

try:
    url = ("https://lgdc.uml.edu/common/DIDBGetValues?"
           "ursiCode=BC840&charName=hmF2"
           "&DMUF=3000&fromDate=2026.074"
           "&toDate=2026.078")
    r = requests.get(url, timeout=20)
    print(f"LGDC status: {r.status_code}")
    if r.status_code == 200 and len(r.text) > 100:
        print(f"Data preview: {r.text[:300]}")
        results['W018_status'] = 'DATA_RETRIEVED'
        results['W018_data'] = r.text[:500]
    else:
        print("LGDC returned empty or error response")
        results['W018_status'] = 'UNRESOLVED'
        results['W018_reason'] = f'HTTP {r.status_code} from lgdc.uml.edu'
except Exception as e:
    print(f"hmF2 fetch failed: {e}")
    results['W018_status'] = 'UNRESOLVED'
    results['W018_reason'] = f'Source inaccessible: {e}'

# ── W020: Roaring 40s 500hPa ─────────────────────────
print("\nW020: Roaring 40s 500hPa >=3% above climatology")
print("Source: psl.noaa.gov")

try:
    # Try NCEP reanalysis composite page (raw data)
    url = "https://psl.noaa.gov/data/correlation/znlw.data"
    r = requests.get(url, timeout=15)
    print(f"PSL status: {r.status_code}")
    if r.status_code == 200:
        text = r.text[:1000]
        print(f"Data preview: {text}")
        results['W020_status'] = 'DATA_RETRIEVED'
        results['W020_data'] = text
    else:
        print("PSL not accessible via this endpoint")
        results['W020_status'] = 'UNRESOLVED'
except Exception as e:
    print(f"PSL fetch failed: {e}")
    results['W020_status'] = 'UNRESOLVED'
    results['W020_reason'] = str(e)

# ── SUMMARY ───────────────────────────────────────────
print("\n" + "=" * 60)
print("RESOLUTION SUMMARY")
print("=" * 60)
print(f"\nW017: {results.get('W017_status', 'see above')}")
if 'W017_max_nPa' in results:
    print(f"  Max SW pressure: {results['W017_max_nPa']:.2f} nPa")
    print(f"  Hours above 5 nPa: {w017_above5_hours}")
    if results.get('W017_precondition'):
        print("  Pre-condition MET. Need SR frequency data.")
        print("  HeartMath GCI not publicly accessible via API.")
        print("  -> Status: UNRESOLVED pending SR data")
print(f"\nW018: {results.get('W018_status', 'see above')}")
if results.get('W018_reason'):
    print(f"  Reason: {results['W018_reason']}")
    print("  -> Status: UNRESOLVED (data source inaccessible)")
print(f"\nW020: {results.get('W020_status', 'see above')}")
if results.get('W020_reason'):
    print(f"  Reason: {results['W020_reason']}")
    print("  -> Status: UNRESOLVED pending NCEP reanalysis")

print("""
CONTEXTUAL NOTE (G3 storm timing):
  March 12-19: Test window
  March 20-21: G3 storm arrived (AFTER test window)

  W020 is about Roaring 40s (Southern Ocean 500hPa).
  The G3 storm arrived AFTER the test window so
  any storm effect doesn't count for this weekly test.
  Test week conditions were pre-storm / transitional.
""")

with open('data/weekly_resolution.json', 'w') as f:
    json.dump({
        'timestamp': datetime.now().isoformat(),
        'test_window': '2026-03-12 to 2026-03-19',
        'results': results
    }, f, indent=2)

print("Saved to data/weekly_resolution.json")
