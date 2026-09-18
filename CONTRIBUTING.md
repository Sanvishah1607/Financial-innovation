# FinGuard Team Contributing Guide 🤝

Welcome **Neev**, **Sanvi**, and **Dhanvi**! 

To make collaboration smooth and conflict-free on our single shared branch (`main`), follow this standard routine.

---

## 🌟 The Golden Git Routine (Every 2 Hours)

### Step 1: ALWAYS Pull Before You Start Coding
Before you open your editor or write any code, ensure you have your teammates' latest updates:
```bash
git pull origin main
```

---

### Step 2: Check Your Work Before Staging
See exactly which files you modified:
```bash
git status
```

---

### Step 3: Stage and Commit With Clear Messages
```bash
git add .
git commit -m "Add [Feature Name]: Brief summary of what was changed"
```
*Example: `git commit -m "Neev: Add transactions placeholder route"`*

---

### Step 4: Pull With Rebase Before Pushing
In the time you were writing code, a teammate might have pushed their commit. Always run:
```bash
git pull origin main --rebase
```
*Why `--rebase`? It places your new commits neatly on top of your teammates' commits without creating messy merge commit bubbles.*

---

### Step 5: Push to GitHub
```bash
git push origin main
```

---

## 🚨 Troubleshooting Common Git Situations

### Situation A: "Git rejected my push!" (Fast-forward error)
**Cause:** A teammate pushed changes while you were working.  
**Solution:**
```bash
git pull origin main --rebase
git push origin main
```

### Situation B: "I have a merge conflict!"
**Don't panic!**
1. Open the conflicting file (marked with `<<<<<<< HEAD` and `>>>>>>>`).
2. Talk with your teammate (e.g., Neev & Sanvi) to decide which lines to keep.
3. Save the file.
4. Run:
   ```bash
   git add <conflicted-file>
   git rebase --continue
   git push origin main
   ```

### Situation C: "I made unwanted changes and want to discard them"
```bash
git restore <file-name>
```

---

## 🛡️ Best Practices for FinGuard
1. **Never commit `.env` files**: All secrets, passwords, and Supabase keys must stay in `.env` (which is in `.gitignore`).
2. **Commit every 2 hours**: Small, frequent commits are easy to debug; giant 10-hour commits cause painful conflicts.
3. **Verify locally before pushing**: Always run `pytest` (for backend) or check the browser (for frontend) before pushing to `main`.
