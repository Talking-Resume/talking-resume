# Exit immediately if a command exits with a non-zero status
set -e

# Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to commit."
  exit 0
fi

# Run Prettier to format JavaScript/JSX files
echo "Running Prettier..."
npx prettier --write "client/**/*.{js,jsx}"

# Run Black to format Python files
echo "Running Black..."
cd server
black .

# Run isort to sort Python imports
echo "Running isort..."
isort .

# Go back to the root directory
cd ..

# Add changes to git
echo "Adding changes to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Apply linting and formatting"

# Push changes to the current branch
echo "Pushing changes to the current branch..."
git push

echo "Changes pushed successfully!"