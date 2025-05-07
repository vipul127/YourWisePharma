# YourWisePharma 🏥💊  
> Empowering better prescription decisions through transparent, data‑driven medicine alternatives.


## 📌 Overview

**YourWisePharma** is a web platform that helps healthcare professionals and patients discover safer, more affordable, and compositionally equivalent medicine alternatives. It combines professional voting, side‑effect analysis, and pricing data to drive informed treatment choices.

![Hero Search Screenshot](images/heroauto.png)
*Hero section with search autocomplete.*

![Hero Search Screenshot](images/search.png)
*Search autocomplete in Medication Pages(detailed search).*

---

# Demo
<video autoplay loop muted playsinline>
  <source src="esign.mp4" type="video/mp4">
</video>



---


## ✨ Features

- 🔍 **Advanced Search**  
  - Lookup by name, composition, therapeutic class, or symptoms  
  - Intelligent autocomplete suggestions  
  - Side‑by‑side medicine comparisons  

![Medication Search Screenshot](images/medicine_detail.png)
*Medicine search page with autocomplete suggestions.*


- 👨‍⚕️ **Professional Recommendations**  
  - Verified doctors can upvote safer alternatives  
  - Transparent consensus rating per medicine  

- 📊 **Comprehensive Medicine Details**  
  - Full ingredient & composition breakdown  
  - Cost analysis and price comparison  
  - Documented side effects & contraindications  

![Medicine Comparison Screenshot](images/comparsion_page.png)
*Side‑by‑side medicine comparison interface.*

- 💻 **User‑Friendly Interface**  
  - Responsive, accessible design  
  - Dark/light theme toggle  
  - Smooth animations with Framer Motion  

---

## 🛠️ Tech Stack

| Layer        | Technologies                                         |
|--------------|------------------------------------------------------|
| **Frontend** | React (TypeScript), TailwindCSS, ShadcnUI, Vite      |
| **Backend**  | FastAPI (Python), PostgreSQL (Supabase), Docker      |
| **Auth**     | Supabase Auth, role‑based access for doctors         |

---

## ⚙️ Configuration

### Frontend

Create a `.env` file in the project root with:
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend

Ensure PostgreSQL is running and a database exists. In the `back/` directory create a `.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_db
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=your_supabase_service_key
```

Optionally adjust CORS, logging, and other FastAPI settings in your configuration file.

---

## 🚀 Installation

### Frontend
```bash
git clone https://github.com/yourusername/yourwisepharma.git
cd yourwisepharma
npm install
npm run dev
```

### Backend
```bash
cd back
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature-name
# implement your changes
git commit -m "feat: describe your feature"
git push origin feature/your-feature-name
```
Open a Pull Request on GitHub!

---

## 🙏 Acknowledgements

- A [Github Repo by junioralive](https://github.com/junioralive/Indian-Medicine-Dataset/) — foundational medicinal composition database  
- Medical professionals for expert feedback  
- Supabase, TailwindCSS, ShadcnUI — open‑source tools  

---

Built with ❤️ to make healthcare safer and smarter.  
