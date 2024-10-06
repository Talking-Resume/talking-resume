
## Talking Resume: An Interactive AI Assistant for Crafting Your Resume

This project empowers you to build a dynamic and insightful talking resume using the power of Artificial Intelligence (AI). It seamlessly integrates chat-based analysis and summary generation to create a resume that stands out.This interaction simulates a real-world interview scenario where a potential employer would ask questions to assess a candidate's suitability for a role.

**Key Features:**

* **AI-powered Chat for Resume Analysis:**  Engage in an interactive conversation with an AI assistant. Ask questions about your resume content, and receive targeted insights and feedback to strengthen your skills and experience sections.
* **Natural Language Processing (NLP):** Leverage the power of NLP to analyze your resume text and gain valuable information about your qualifications. 
* **AI-Generated Summary:** After interacting with the AI, get a comprehensive summary of your resume that highlights your strengths, weaknesses, and potential areas for improvement. 
* **Secure and User-Friendly:** Enjoy a secure platform with user authentication and a user-friendly interface for seamless interaction with the AI assistant.

**Benefits:**

* **Go beyond Static Text:** Ditch the limitations of a static resume. Engage in a dynamic conversation to showcase your skills and experiences in an engaging way.
* **Personalized Feedback:** Receive tailored feedback and insights specific to your resume content.
* **Strengthen your Resume:** Identify areas for improvement and highlight your most relevant skills and achievements for potential employers. 

**Technology Stack:**

* **LangChain:** A powerful NLP framework for facilitating the interactive chat experience.
* **Vertex AI (Google Cloud):** Leverages Google's AI platform for understanding resume text and generating relevant responses.
* **Supabase:** A cloud-based storage solution for securely storing uploaded resumes and user authentication.
* **FastAPI:** A Python framework for building the backend API endpoints.
* **NextJs**
  
## Local Environment Setup
## Method 1
#### Prerequisites
Before you begin, ensure that you have the following installed on your local machine:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Setup

1. **Clone the Repository**  
   If you haven’t already, clone the repository that contains the `docker-compose.yml` file.

   ```
   git clone https://github.com/Talking-Resume/talking-resume.git
   ```
   
2. **Configuration**
    To configure Talking Resume, you will need to set up your social media API keys. Create a `.env` file in the root directory and add the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     API_BASE_URL=your_api_base_url
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_key
     GOOGLE_CLOUD_PROJECT=your_google_cloud_project_id
     GOOGLE_API_KEY=your_google_api_key
     GOOGLE_APPLICATION_CREDENTIALS=your_google_application_credentials_path
     ```

4. **Build and Start the Services**
    Run the following command to build and start the services defined in the `docker-compose.yml` file.

   ```
   bash scripts/start.sh
   ```


   ### Access the Application
   - The client application will be accessible at [http://localhost:3000](http://localhost:3000).
   - The server API will be accessible at [http://127.0.0.1:8000](http://localhost:8000).

  

   ### Stop the Services
   To stop the running services, use:

   ```
   bash scripts/stop.sh
   ```


## Method 2
#### Prerequisites
  ##### Before you begin, ensure that you have the following installed on your local machine:
   - Node.js and npm installed for the client
   - Python and virtualenv installed for the server
### Running the Client
1. Install the dependencies:
   ```bash
   cd client
   npm install
   ```
2. Configure the .env for client:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   API_BASE_URL=your_api_base_url
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Server

1. Set up a virtual environment:
   ```bash
   cd server
   virtualenv venv
   ```
2. Configure the .env for client:
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   GOOGLE_CLOUD_PROJECT=your_google_cloud_project_id
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_APPLICATION_CREDENTIALS=your_google_application_credentials_path
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the server:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```


## Contributing to the Talking Resume Project

We welcome your contributions to make Talking Resume even better! This guide outlines how you can participate in the project's development.  


**How to Contribute:**

1. **Fork the Repository:** Go to the Talking Resume project repository on GitHub and click "Fork" to create your own copy.
  
2. **Clone your Fork:** Open your terminal and navigate to your desired directory. Use the `git clone` command to clone your forked repository locally. The command will look something like:

   ```bash
   git clone https://github.com/{username}/talking-resume.git
   ```
   
3. **Create a Branch:** Switch to your local project directory and create a new branch for your specific changes. It's recommended to use descriptive branch names that reflect your contribution. Here's how to create a branch and switch to it:

   ```bash
   cd talking-resume
   git checkout -b <branch-name>
   ```
   

4. **Make Your Changes:** Edit the relevant code files and make your contributions. Follow the existing code style and formatting conventions.
  
   
5. **Run Linting and Formatting and Push to your branch:**  Before committing your changes, run the provided script `push_to_github.sh` to ensure your code adheres to the project's formatting standards. This script automatically formats your code using Prettier (JavaScript/JSX), Black (Python), and isort (Python imports) and then pushes it to your branch. You can run the script from the project root directory:

   ```bash
   ./push_to_github.sh
   ```  

6. **Create a Pull Request:**  Go to your forked repository on GitHub and navigate to the "Pull requests" tab. Click "New pull request" and select the branch containing your changes to compare it with the project's main branch. Write a clear description of your contribution and submit the pull request.

7. **Review and Merge:** Project maintainers will review your pull request and provide feedback if needed. Once approved, your changes will be merged into the main Talking Resume repository.
   

**Additional Tips:**

* Make sure your changes address a specific issue or feature request. If you're unsure, feel free to discuss them in the project's issue tracker before starting work.
* Write clear and concise commit messages that describe your changes accurately.
* Follow the project's coding style and formatting conventions.
* Test your changes locally before submitting a pull request.

We appreciate your contributions to the Talking Resume project!
