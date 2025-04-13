from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import pandas as pd
import sqlite3
import language_tool_python
import smtplib
from email.message import EmailMessage
import os

default_args = {
    'owner': 'edukita',
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
}

ASSIGNMENT_PATH = '/home/plato-z/labs/codes/edukita_technical_submission/airflow/data/assignment/english_assignments.csv'
REPORT_PATH = '/home/plato-z/labs/codes/edukita_technical_submission/airflow/data/report/english_mistakes_report.csv'

def extract_assignments():
    conn = sqlite3.connect('/home/plato-z/labs/codes/edukita_technical_submission/database.sql')
    query = "SELECT id, content FROM assignment WHERE subject='English'"
    df = pd.read_sql_query(query, conn)
    conn.close()
    df.to_csv(ASSIGNMENT_PATH, index=False)

def analyze_mistakes():
    df = pd.read_csv(ASSIGNMENT_PATH)
    tool = language_tool_python.LanguageTool('en-US')

    mistake_counter = {}
    for content in df['content']:
        matches = tool.check(content)
        for match in matches:
            rule_id = match.ruleId
            mistake_counter[rule_id] = mistake_counter.get(rule_id, 0) + 1

    report_df = pd.DataFrame(list(mistake_counter.items()), columns=["Rule id", "Count"])
    report_df.sort_values(by="Count", ascending=False, inplace=True)
    report_df.to_csv(REPORT_PATH, index=False)

def notify_teachers():
    smtp_host = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("EMAIL_PORT", "587"))
    smtp_user = os.getenv("EMAIL_USER")
    smtp_pass = os.getenv("EMAIL_PASSWORD")
    from_email = os.getenv("EMAIL_FROM", smtp_user)
    to_emails = ["english-teacher@edukita.edu", "english-teacher1@edukita.edu", "english-teacher2@edukita.edu"]  # add multiple recipients

    msg = EmailMessage()
    msg['Subject'] = "English Mistakes Report"
    msg['From'] = from_email
    msg['To'] = ", ".join(to_emails)
    msg.set_content("Dear teacher,\n\nAttached is the latest English assignment mistake trend report.\n\nBest regards,\nEdukita Assignment System")

    # Attach CSV file
    with open(REPORT_PATH, 'rb') as file:
        file_data = file.read()
        msg.add_attachment(file_data, maintype='application', subtype='csv', filename='english_mistakes_report.csv')

    with smtplib.SMTP(smtp_host, smtp_port) as smtp:
        smtp.starttls()
        smtp.login(smtp_user, smtp_pass)
        smtp.send_message(msg)

with DAG(
    dag_id='analyze_english_assignment_trends',
    description='Analyze English writing assignments and email report to teachers',
    start_date=datetime(2025, 1, 1),
    schedule_interval='@daily',
    catchup=False,
    default_args=default_args,
    tags=["report", "nlp", "education"]
) as dag:

    extract = PythonOperator(
        task_id='extract_assignments',
        python_callable=extract_assignments
    )

    analyze = PythonOperator(
        task_id='analyze_english_mistakes',
        python_callable=analyze_mistakes
    )

    notify = PythonOperator(
        task_id='notify_teachers_email',
        python_callable=notify_teachers
    )

    extract >> analyze >> notify
