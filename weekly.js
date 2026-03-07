const WEEKLY_DATA = {
  "week_start": "2026-03-06",
  "week_end": "2026-03-13",
  "generated": "2026-03-06T19:04:11.162121",
  "predictions": [
    {
      "id": "W001",
      "title": "Lunar Transit Magnetic Anomaly",
      "station": "HUA",
      "prediction_nT": -2.1,
      "uncertainty_nT": 0.8,
      "test_date": "2026-03-06",
      "status": "below_detection_threshold",
      "verdict": "below_detection_threshold",
      "counts_against_model": false,
      "mainstream_expected_nT": "0.1 to 0.5",
      "assessment": "Signal exists in literature but below single-station detection threshold. Not a model failure - a detection method limitation. Multi-station averaging required for sub-2nT signals.",
      "implication": "Eclipse predictions at -5.8 to -9.5 nT are well above detection threshold - method valid",
      "display_color": "yellow",
      "display_label": "BELOW THRESHOLD",
      "point_prediction": {
        "value": -2.1,
        "uncertainty": 0.8,
        "range": [
          -2.9,
          -1.3
        ],
        "confidence": "1-sigma"
      },
      "scoring_matrix": [
        {
          "claim": "Signal is correct polarity",
          "weight": "HIGH",
          "auto_check": "direction_correct",
          "points_if_correct": 5,
          "points_if_wrong": -5
        },
        {
          "claim": "Signal exceeds noise floor",
          "weight": "HIGH",
          "auto_check": "observed.snr >= 2.0",
          "points_if_correct": 3,
          "points_if_wrong": 0
        },
        {
          "claim": "Magnitude within 1-sigma",
          "weight": "MEDIUM",
          "auto_check": "sigma_distance <= 1.0",
          "points_if_correct": 2,
          "points_if_wrong": -1
        }
      ],
      "max_possible_score": 10,
      "win_threshold": 5,
      "strong_win_threshold": 8
    },
    {
      "id": "W002",
      "title": "SAA Node Check vs CHAOS-7",
      "target_date": "2026-03-07",
      "status": "pending",
      "point_prediction": {
        "value": null,
        "uncertainty": null,
        "range": [
          0,
          0
        ],
        "confidence": "1-sigma"
      },
      "scoring_matrix": [
        {
          "claim": "Signal is correct polarity",
          "weight": "HIGH",
          "auto_check": "direction_correct",
          "points_if_correct": 5,
          "points_if_wrong": -5
        },
        {
          "claim": "Signal exceeds noise floor",
          "weight": "HIGH",
          "auto_check": "observed.snr >= 2.0",
          "points_if_correct": 3,
          "points_if_wrong": 0
        },
        {
          "claim": "Magnitude within 1-sigma",
          "weight": "MEDIUM",
          "auto_check": "sigma_distance <= 1.0",
          "points_if_correct": 2,
          "points_if_wrong": -1
        }
      ],
      "max_possible_score": 10,
      "win_threshold": 5,
      "strong_win_threshold": 8
    },
    {
      "id": "W003",
      "title": "Telluric 11.78 Hz Peak",
      "target_date": "2026-03-06",
      "status": "pending",
      "point_prediction": {
        "value": null,
        "uncertainty": null,
        "range": [
          0,
          0
        ],
        "confidence": "1-sigma"
      },
      "scoring_matrix": [
        {
          "claim": "Signal is correct polarity",
          "weight": "HIGH",
          "auto_check": "direction_correct",
          "points_if_correct": 5,
          "points_if_wrong": -5
        },
        {
          "claim": "Signal exceeds noise floor",
          "weight": "HIGH",
          "auto_check": "observed.snr >= 2.0",
          "points_if_correct": 3,
          "points_if_wrong": 0
        },
        {
          "claim": "Magnitude within 1-sigma",
          "weight": "MEDIUM",
          "auto_check": "sigma_distance <= 1.0",
          "points_if_correct": 2,
          "points_if_wrong": -1
        }
      ],
      "max_possible_score": 10,
      "win_threshold": 5,
      "strong_win_threshold": 8
    },
    {
      "id": "W004",
      "title": "2024 Eclipse Data Replication",
      "target_date": "2026-03-06",
      "status": "pending",
      "point_prediction": {
        "value": null,
        "uncertainty": null,
        "range": [
          0,
          0
        ],
        "confidence": "1-sigma"
      },
      "scoring_matrix": [
        {
          "claim": "Signal is correct polarity",
          "weight": "HIGH",
          "auto_check": "direction_correct",
          "points_if_correct": 5,
          "points_if_wrong": -5
        },
        {
          "claim": "Signal exceeds noise floor",
          "weight": "HIGH",
          "auto_check": "observed.snr >= 2.0",
          "points_if_correct": 3,
          "points_if_wrong": 0
        },
        {
          "claim": "Magnitude within 1-sigma",
          "weight": "MEDIUM",
          "auto_check": "sigma_distance <= 1.0",
          "points_if_correct": 2,
          "points_if_wrong": -1
        }
      ],
      "max_possible_score": 10,
      "win_threshold": 5,
      "strong_win_threshold": 8
    },
    {
      "id": "W005",
      "title": "North Pole Acceleration Update",
      "target_date": "2026-03-06",
      "status": "pending",
      "point_prediction": {
        "value": null,
        "uncertainty": null,
        "range": [
          0,
          0
        ],
        "confidence": "1-sigma"
      },
      "scoring_matrix": [
        {
          "claim": "Signal is correct polarity",
          "weight": "HIGH",
          "auto_check": "direction_correct",
          "points_if_correct": 5,
          "points_if_wrong": -5
        },
        {
          "claim": "Signal exceeds noise floor",
          "weight": "HIGH",
          "auto_check": "observed.snr >= 2.0",
          "points_if_correct": 3,
          "points_if_wrong": 0
        },
        {
          "claim": "Magnitude within 1-sigma",
          "weight": "MEDIUM",
          "auto_check": "sigma_distance <= 1.0",
          "points_if_correct": 2,
          "points_if_wrong": -1
        }
      ],
      "max_possible_score": 10,
      "win_threshold": 5,
      "strong_win_threshold": 8
    },
    {
      "id": "W006",
      "title": "SAA Intensity Update",
      "target_date": "2026-03-06",
      "status": "pending",
      "point_prediction": {
        "value": null,
        "uncertainty": null,
        "range": [
          0,
          0
        ],
        "confidence": "1-sigma"
      },
      "scoring_matrix": [
        {
          "claim": "Signal is correct polarity",
          "weight": "HIGH",
          "auto_check": "direction_correct",
          "points_if_correct": 5,
          "points_if_wrong": -5
        },
        {
          "claim": "Signal exceeds noise floor",
          "weight": "HIGH",
          "auto_check": "observed.snr >= 2.0",
          "points_if_correct": 3,
          "points_if_wrong": 0
        },
        {
          "claim": "Magnitude within 1-sigma",
          "weight": "MEDIUM",
          "auto_check": "sigma_distance <= 1.0",
          "points_if_correct": 2,
          "points_if_wrong": -1
        }
      ],
      "max_possible_score": 10,
      "win_threshold": 5,
      "strong_win_threshold": 8
    },
    {
      "id": "W007",
      "title": "Geomagnetic Jerk Detector",
      "target_date": "2026-03-06",
      "status": "pending",
      "point_prediction": {
        "value": null,
        "uncertainty": null,
        "range": [
          0,
          0
        ],
        "confidence": "1-sigma"
      },
      "scoring_matrix": [
        {
          "claim": "Signal is correct polarity",
          "weight": "HIGH",
          "auto_check": "direction_correct",
          "points_if_correct": 5,
          "points_if_wrong": -5
        },
        {
          "claim": "Signal exceeds noise floor",
          "weight": "HIGH",
          "auto_check": "observed.snr >= 2.0",
          "points_if_correct": 3,
          "points_if_wrong": 0
        },
        {
          "claim": "Magnitude within 1-sigma",
          "weight": "MEDIUM",
          "auto_check": "sigma_distance <= 1.0",
          "points_if_correct": 2,
          "points_if_wrong": -1
        }
      ],
      "max_possible_score": 10,
      "win_threshold": 5,
      "strong_win_threshold": 8
    },
    {
      "id": "W008",
      "title": "Coronal Hole Correlation",
      "target_date": "2026-03-06",
      "status": "pending",
      "point_prediction": {
        "value": null,
        "uncertainty": null,
        "range": [
          0,
          0
        ],
        "confidence": "1-sigma"
      },
      "scoring_matrix": [
        {
          "claim": "Signal is correct polarity",
          "weight": "HIGH",
          "auto_check": "direction_correct",
          "points_if_correct": 5,
          "points_if_wrong": -5
        },
        {
          "claim": "Signal exceeds noise floor",
          "weight": "HIGH",
          "auto_check": "observed.snr >= 2.0",
          "points_if_correct": 3,
          "points_if_wrong": 0
        },
        {
          "claim": "Magnitude within 1-sigma",
          "weight": "MEDIUM",
          "auto_check": "sigma_distance <= 1.0",
          "points_if_correct": 2,
          "points_if_wrong": -1
        }
      ],
      "max_possible_score": 10,
      "win_threshold": 5,
      "strong_win_threshold": 8
    }
  ]
};