PROFILE=$1  # profile for target instance
REGION=$2
STACK_NAME=$3

echo "aws cloudformation describe-stacks --stack-name $STACK_NAME --profile $PROFILE --region $REGION --output json --query 'Stacks[0].Outputs' "
# aws cloudformation describe-stacks --stack-name serverless-tdb-app-dev --profile eds-sandbox --region us-east-1 --output json --query 'Stacks[0].Outputs'

outputs=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --profile $PROFILE --region $REGION --output json --query 'Stacks[0].Outputs')
echo $outputs > './outputs.json'
echo $outputs

distributionid=$( cat ./outputs.json | jq -r 'map(select(.OutputKey == "CognitoDistributionId"))[0] | "\(.OutputValue)"' )
hostBucket=$( cat ./outputs.json | jq -r 'map(select(.OutputKey == "HostBucket"))[0] | "\(.OutputValue)"' )
echo "DistributionID - ${distributionid}"
echo "Host Bucket - ${hostBucket}"

aws s3 sync ../frontend/dist s3://${hostBucket} --delete --profile $PROFILE --region $REGION
aws cloudfront create-invalidation --distribution-id ${distributionid} --paths /* --profile $PROFILE --region $REGION
