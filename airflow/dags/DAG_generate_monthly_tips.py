from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import sqlite3
import pandas as pd
import os
import google.generativeai as genai

# Setup
default_args = {
    'owner': 'edukita',
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

# Env config
DB_PATH = '/home/plato-z/labs/codes/edukita_technical_submission/database.sql'
OUTPUT_PATH = '/home/plato-z/labs/codes/edukita_technical_submission/airflow/data/report/monthly_tips.csv'
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-001')
# model = genai.GenerativeModel('gemini-2.0-flash-lite-001')

def extract_monthly_assignments():
    """get all assignment english from the last 30 days"""
    conn = sqlite3.connect(DB_PATH)
    query = """
        SELECT a.id, a.content, u.name AS student_name
        FROM assignment a
        JOIN user u ON a.student_id = u.id
        WHERE a.subject = 'English' AND a.createdAt >= date('now', '-30 day')
    """
    df = pd.read_sql_query(query, conn)
    conn.close()
    df.to_csv('/home/plato-z/labs/codes/edukita_technical_submission/airflow/data/assignment/monthly_assignments.csv', index=False)

def generate_tips():
    df = pd.read_csv('/home/plato-z/labs/codes/edukita_technical_submission/airflow/data/assignment/monthly_assignments.csv')
    tips_data = []

    for _, row in df.iterrows():
        prompt = f"""
        You're an English writing tutor. Read this student's assignment and write 3 personalized writing improvement tips.

        Student: {row['student_name']}
        Assignment: "{row['content']}"

        Tips:
        """

        try:
            result = model.generate_content(prompt)
            tips = result.text.strip()
        except Exception as e:
            tips = f"ERROR: {str(e)}"

        tips_data.append({
            "student_name": row["student_name"],
            "assignment_id": row["id"],
            "tips": tips
        })

    tips_df = pd.DataFrame(tips_data)
    tips_df.to_csv(OUTPUT_PATH, index=False)

def notify_log():
    print(f"✅ Tips generated and saved to: {OUTPUT_PATH}")

# DAG definition
with DAG(
    dag_id='generate_monthly_personalized_tips',
    description='Generate monthly personalized learning tips for students via Gemini',
    schedule_interval='@monthly',
    start_date=datetime(2025, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=["genai", "monthly", "nlp", "tips"]
) as dag:

    extract = PythonOperator(
        task_id='extract_monthly_assignments',
        python_callable=extract_monthly_assignments
    )

    generate = PythonOperator(
        task_id='generate_personalized_tips',
        python_callable=generate_tips
    )

    notify = PythonOperator(
        task_id='notify_done',
        python_callable=notify_log
    )

    extract >> generate >> notify
