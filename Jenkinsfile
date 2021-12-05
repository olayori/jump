pipeline {
  environment {
    registry = "olayori/jump_api"
    registryCredential = '38dfd1a1-4f5b-40cb-b37b-d47dec0c8ef2'
    dockerImage = ''
  }
  agent any
  stages {
    stage('Git Checkout') {
      steps {
        git credentialsId: 'github-token', url: 'https://github.com/olayori/jump_pipeline.git'
      }
    }
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry
        }
      }
    }
    stage('Push Image to DockerHub') {
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push('latest')
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:latest"
      }
    }
    stage('Deploy Image to ECS') {
      steps{
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "AWS_CREDS", accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
        ]]) {
          sh "ecs deploy --image jumpcloud_api_container docker.io/olayori/jumpcloud_api:latest JumpCloud-ECS-Cluster jumpcloud-api --region us-east-1 --access-key-id $AWS_ACCESS_KEY_ID --secret-access-key $AWS_SECRET_ACCESS_KEY  --rollback --timeout 900"
        }
      }
    }    
  }
}