set -e

PROFILE=lsoft  # profile for target instance
REGION=us-east-1

# Must be created manually
BUCKET="serverless-deploy-all-lsft-projects"

# General parameters
APPLICATION="serverless"
PROJECT="react"
ENVIRONMENT="dev"
STACK_NAME="$APPLICATION-$PROJECT-$ENVIRONMENT"
TEMPLATE="template.yaml"
DEPLOY_CUSTOM_HANDLER="false"

# Build 
echo "Building Serverless React Demo project with SAM"

# # Build lambdas
# echo "Building Sam Discovery Lambdas"
# cd src
npm install 
npm run build
# cd ..

pwd



sam build --template $TEMPLATE \
&& sam deploy \
  --template $TEMPLATE \
  --stack-name $STACK_NAME \
  --s3-bucket $BUCKET \
  --s3-prefix $STACK_NAME \
  --tags \
    "Client"=$APPLICATION \
    "Project"=$PROJECT \
    "Environment"=$ENVIRONMENT \
  --parameter-overrides \
    ParameterKey=Application,ParameterValue=$APPLICATION \
    ParameterKey=Project,ParameterValue=$STACK_NAME \
    ParameterKey=Environment,ParameterValue=$ENVIRONMENT \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
  --region $REGION \
  --profile $PROFILE


# Error message
# aws sns publish --topic-arn arn:aws:sns:us-east-1:001668627821:sam-disco-infra-experiment-dev --message "Hello World"
# aws sns publish --topic-arn arn:aws:sns:us-east-1:001668627821:sam-disco-infra-experiment-dev --message "I DEMAND TO SEE THE DEAD LETTER QUEUE"
# Success message
# aws sns publish --topic-arn arn:aws:sns:us-east-1:001668627821:sam-disco-infra-experiment-dev --message "{\"id\":\"id-1\",\"name\":\"Hello World\", \"description\": \"Adopt easilt the best practices in your apps\"}"


# cd src && \
# sam build && \
# sam package --output-template-file packaged-template.yaml --s3-bucket ${S3_BUCKET} --region ${REGION} --profile ${PROFILE} && \
# sam deploy --template-file packaged-template.yaml --region ${REGION} --capabilities CAPABILITY_IAM --stack-name ${STACK_NAME} \
#   --parameter-overrides ProjectName=${STACK_NAME} Environment=${ENVIRONMENT} \
#   FrontEndUrl=${APP_URL} --profile ${PROFILE}


# outputs=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --output json --query 'Stacks[0].Outputs')
# echo $outputs > './outputs.json'
# echo $outputs