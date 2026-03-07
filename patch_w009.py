import json
import hashlib

filepath = "/Users/nicholashughes/.gemini/antigravity/scratch/astro_observations/predictions/proofs/weekly_predictions_2026-03-06.json"

with open(filepath, "r") as f:
    data = json.load(f)

new_payload = [
{"id":"W009","title":"SAA African Cell Intensity Check","target_date":"2026-03-13","prediction":"African cell minimum < 21,795 nT","predicted_value":21795,"unit":"nT","uncertainty":30,"formula":"WIN-005 decay rate: 21,880 nT declining ~85 nT/year","mechanism":"Aetheric rim degradation accelerating African lobe decay","verification_source":"CHAOS-7","status":"pending","counts_against_model":True},
{"id":"W010","title":"North Pole Position Check","target_date":"2026-03-13","prediction":"Deviation from 120E longitude > -18 degrees","predicted_value":-18,"unit":"degrees","uncertainty":0.5,"formula":"WIN-007 exponential approach, deviation -18.06 at 2025 accelerating","mechanism":"Precession vortex convergence toward Polaris axis","verification_source":"NOAA NP.xy","status":"pending","counts_against_model":True},
{"id":"W011","title":"Field Decay Rate Confirmation","target_date":"2026-03-13","prediction":"Global dipole decreased >= 28 nT since March 2025","predicted_value":-28,"unit":"nT/year","uncertainty":3,"formula":"F7: decay >= 28 nT/year","mechanism":"Aetheric medium degradation post-2000 acceleration","verification_source":"INTERMAGNET annual","status":"pending","counts_against_model":True},
{"id":"W012","title":"SAA Separation 2026 Check","target_date":"2026-03-13","prediction":"SAA cell longitude separation = 51.57 degrees","predicted_value":51.57,"unit":"degrees","uncertainty":1.5,"formula":"F4: separation(2026) = 49.956 + 3.539 * exp(0.03146 * 36) = 51.57","mechanism":"Exponential aetheric field separation","verification_source":"CHAOS-7","status":"pending","counts_against_model":True},
{"id":"W013","title":"Schumann 7.83 Hz Anomaly Persistence","target_date":"2026-03-13","prediction":"Measured Schumann fundamental remains 7.83 Hz +/- 0.3 Hz","predicted_value":7.83,"unit":"Hz","uncertainty":0.3,"formula":"F3: theoretical 10.59 Hz vs measured 7.83 Hz, gap = 2.76 Hz from aetheric damping","mechanism":"Aetheric damping of enclosed resonant cavity","verification_source":"Tomsk/HeartMath Schumann monitors","status":"pending","counts_against_model":True},
{"id":"W014","title":"Crepuscular Ray Divergence","target_date":"2026-03-13","prediction":"Crepuscular rays show divergence angles > 0.5 degrees","predicted_value":0.5,"unit":"degrees","uncertainty":0.1,"formula":"arctan(horizontal_distance / sun_altitude_5733km) \u2014 parallel rays impossible at 150M km","mechanism":"Local compact sun at 5,733 km altitude producing diverging rays","verification_source":"Clear sky photography any location","status":"pending","counts_against_model":True},
{"id":"W015","title":"Lunar Phase Magnetic Correlation","target_date":"2026-03-11","prediction":"Z component shift 0.5-2.0 nT correlated with full moon March 11","predicted_value":-1.0,"unit":"nT","uncertainty":0.5,"formula":"F1 scaled: full moon alignment produces measurable Z shift","mechanism":"Lunar aetheric pressure modulation","verification_source":"INTERMAGNET","status":"pending","counts_against_model":False,"note":"SNR likely marginal \u2014 log as below_detection_threshold if SNR < 2.0"},
{"id":"W016","title":"Baseline Recalibration from W004","target_date":"2026-03-13","prediction":"True quiet-day baseline = -6.5 to -7.5 nT (recalculated from W004 overshoot)","predicted_value":-7.0,"unit":"nT","uncertainty":0.5,"formula":"true_baseline = observed_W004 / (coverage_2024 * lat_factor_2024) = -17.6 / (coverage * lat)","mechanism":"Formula self-correction \u2014 W004 overshoot indicates BOU 2017 disturbed-day baseline inflated by ~35-40%","verification_source":"W004 result + August 2026 eclipse","status":"pending","counts_against_model":False,"note":"This recalibration adjusts PRED-001 through PRED-005 downward ~30% for August eclipse"}
]

# Generate SHAs and merge
new_map = {p["id"]: p for p in new_payload}

filtered_preds = []
for p in data["predictions"]:
    if p["id"] not in new_map:
        filtered_preds.append(p)

for p in new_payload:
    p_str = json.dumps(p, sort_keys=True)
    p["sha256"] = hashlib.sha256(p_str.encode()).hexdigest()
    filtered_preds.append(p)

data["predictions"] = filtered_preds

with open(filepath, "w") as f:
    json.dump(data, f, indent=2)

print("Proof file updated with exact user payload.")
