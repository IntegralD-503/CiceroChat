FROM public.ecr.aws/lambda/python:3.9

RUN yum -y upgrade
RUN yum -y install gcc-c++

# Add supporting modules 
COPY ./schema ${LAMBDA_TASK_ROOT}/schema
COPY ./redisDB ${LAMBDA_TASK_ROOT}/redisDB
COPY ./agent ${LAMBDA_TASK_ROOT}/agent

COPY .env ${LAMBDA_TASK_ROOT}
# Copy requirements.txt
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Copy function code
COPY askQuestion.py ${LAMBDA_TASK_ROOT}

# Install the specified packages
RUN pip install -r requirements.txt

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "askQuestion.main" ]