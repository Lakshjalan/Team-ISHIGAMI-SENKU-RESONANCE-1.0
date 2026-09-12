# Role Specification: ML & AI Model Engineer
## Candidate Blocking, Supervised Pairwise Matcher & Custom LLM Arbitrator

**Owner**: ML & AI Model Engineer  
**Domain**: Candidate Pair Blocking, Feature Vector Extraction, Supervised Pairwise ML Matching (XGBoost/RandomForest), Custom In-House LLM Arbitrator Engine  
**Architecture Reference**: [TRD.md](file:///c:/Users/laksh/Desktop/Resonance/TRD.md) | [architecture.md](file:///c:/Users/laksh/Desktop/Resonance/architecture.md)

---

## 1. Overview & Core Mission
The Machine Learning & AI Engineer is responsible for the intelligence layer of **Veritas ER / SYNTRA**. This role develops the 3-tier hybrid matching engine: high-recall candidate blocking to eliminate $O(N^2)$ comparisons, feature vector calculation using string distance metrics, supervised pairwise classification to score match confidence $C_{match} \in [0.0, 1.0]$, and a custom in-house LLM Arbitrator service (`ml/src/llm_arbitrator.py`) to explain conflicts and recommend merged golden values.

---

## 2. Direct Folder & File Ownership

### 📁 Owned Files & Components
```text
ml/
├── requirements.txt                      # Python dependencies (scikit-learn, xgboost, torch, transformers, pandas, numpy, jellyfish, fastapi)
├── src/
│   ├── blocking.py                       # High-Recall Candidate Pair Generator (trigram / rule-based blocking)
│   ├── feature_extraction.py            # Feature vector calculator (Jaro-Winkler, Levenshtein, Metaphone, Jaccard)
│   ├── pairwise_matcher.py              # Supervised ML model inference script (calculates C_match probability)
│   └── llm_arbitrator.py                # Custom In-House LLM Arbitrator Engine & Inference API (FastAPI / PyTorch / Local LLM)
├── models/
│   ├── xgboost_entity_matcher.pkl        # Trained pairwise classifier model binary
│   └── custom_llm_arbitrator/            # Custom fine-tuned LLM model weights / artifacts
├── notebooks/
│   ├── train_matcher.ipynb               # Pairwise model training notebook & benchmark evaluation
│   └── fine_tune_llm.ipynb               # Custom LLM Arbitrator fine-tuning notebook
backend/src/services/
├── blockingService.js                    # Node.js wrapper for Candidate Blocking (shared with Backend)
└── llmArbitrator.js                      # Node.js REST client calling Custom ML LLM Arbitrator service
```

---

## 3. Key Responsibilities & Features

1. **Tier 1: High-Recall Candidate Blocking & Feature Extraction (`blocking.py`, `feature_extraction.py`)**
   - Implement blocking strategies (using trigram indexing or canopy clustering) to shrink candidate pair search space from $O(N^2)$ to $O(N \log N)$.
   - Generate similarity feature vector $\vec{x}$ for candidate pair $(R_A, R_B)$:
     - $x_1$: Jaro-Winkler distance on Name
     - $x_2$: Levenshtein distance on Name tokens
     - $x_3$: Phonetic match boolean (Double Metaphone / Soundex)
     - $x_4$: Exact Phone match boolean (E.164 standardized)
     - $x_5$: Exact Email match boolean (domain/dot normalized)
     - $x_6$: Organization / Address string similarity (Jaccard / Cosine)

2. **Tier 2: Supervised Pairwise ML Matcher (`pairwise_matcher.py`, `notebooks/train_matcher.ipynb`)**
   - Train a supervised binary classifier (XGBoost / Random Forest) on labeled record pair datasets.
   - Output continuous match probability score $C_{match} \in [0.0, 1.0]$.
   - Establish decision thresholds:
     - **Auto-Resolve ($C_{match} \ge 0.90$)**: Automatically link and create Golden Master Record.
     - **Human Review ($0.60 \le C_{match} < 0.90$)**: Flag and send pair to Supabase `student_conflict_queue`.
     - **Distinct Entity ($C_{match} < 0.60$)**: Treat records as separate real-world entities.

3. **Tier 3: Custom In-House LLM Arbitrator & Natural Language Explainer (`llm_arbitrator.py`)**
   - Build and serve a custom LLM Arbitrator microservice (via FastAPI/vLLM/Transformers/Ollama).
   - Input structured candidate student pairs with conflicting attributes (e.g. Reg No matches, but Name or Branch slightly differs).
   - Output structured JSON response containing:
     - `recommended_value`: Field value with highest credibility.
     - `reasoning`: Concise, natural language explanation of the conflict resolution.
     - `field_confidence`: Numerical confidence score for each field.

---

## 4. API & Integration Handoff Points

- **Interface with Backend Engineer (Laksh)**:
  - Expose Custom LLM Arbitrator & ML Matcher as a local FastAPI microservice (e.g. `http://localhost:8000/arbitrate`).
  - Receive candidate pairs from Backend `entityResolutionService.js` and return JSON payload containing score $C_{match}$, triage classification, and custom LLM reasoning text.

---

## 5. Definition of Done (DoD)
- [ ] Candidate blocking reduces evaluation pair count by $\ge 90\%$ while retaining high recall.
- [ ] Feature extraction module computes accurate string similarity metrics for input pairs.
- [ ] Supervised pairwise model achieves target F1-score on benchmark dataset and outputs probability $C_{match}$.
- [ ] Custom In-House LLM Arbitrator outputs valid structured JSON with clear natural language reasoning text.
- [ ] Custom ML service responds cleanly to backend orchestrator API calls.

