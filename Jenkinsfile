pipeline {
    agent any
    
    environment {
        // Assume Docker Hub credentials are added in Jenkins as username/password with ID 'docker-hub-token'
        DOCKER_HUB = credentials('docker-hub-token')
        // Assume Slack webhook is added in Jenkins as secret text with ID 'slack-webhook'
        SLACK_WEBHOOK_URL = credentials('slack-webhook')
    }
    
    stages {
        stage('Lint') {
            steps {
                retry(3) {
                    dir('frontend') {
                        sh 'npm install'
                        sh 'npm run lint'
                    }
                    dir('backend') {
                        sh 'npm install'
                        sh 'npm run lint'
                    }
                }
            }
        }
        stage('Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }
        stage('Build') {
            steps {
                script {
                    def commitSha = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    
                    dir('frontend') {
                        sh "docker build -t \${DOCKER_HUB_USR}/pulsecheck-frontend:${commitSha} ."
                        sh "docker tag \${DOCKER_HUB_USR}/pulsecheck-frontend:${commitSha} \${DOCKER_HUB_USR}/pulsecheck-frontend:latest-candidate"
                    }
                    dir('backend') {
                        sh "docker build -t \${DOCKER_HUB_USR}/pulsecheck-backend:${commitSha} ."
                        sh "docker tag \${DOCKER_HUB_USR}/pulsecheck-backend:${commitSha} \${DOCKER_HUB_USR}/pulsecheck-backend:latest-candidate"
                    }
                }
            }
        }
        stage('Push') {
            steps {
                retry(3) {
                    script {
                        def commitSha = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                        
                        // Login to Docker Hub using injected credentials
                        sh "echo \${DOCKER_HUB_PSW} | docker login -u \${DOCKER_HUB_USR} --password-stdin"
                        
                        sh "docker push \${DOCKER_HUB_USR}/pulsecheck-frontend:${commitSha}"
                        sh "docker push \${DOCKER_HUB_USR}/pulsecheck-frontend:latest-candidate"
                        
                        sh "docker push \${DOCKER_HUB_USR}/pulsecheck-backend:${commitSha}"
                        sh "docker push \${DOCKER_HUB_USR}/pulsecheck-backend:latest-candidate"
                    }
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    def commitSha = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    
                    // Re-login to ensure credentials are valid for the deploy script's push of :latest
                    sh "echo \${DOCKER_HUB_PSW} | docker login -u \${DOCKER_HUB_USR} --password-stdin"
                    
                    // Run the deployment and rollback script
                    sh "chmod +x deploy.sh"
                    sh "./deploy.sh ${commitSha} \${DOCKER_HUB_USR}"
                }
            }
        }
    }
    
    post {
        failure {
            script {
                def isRollback = fileExists('.rollback_occurred')
                
                // Cleanup immediately so a Slack network failure doesn't leave the flag stale
                if (isRollback) {
                    sh "rm -f .rollback_occurred"
                }

                def message = isRollback 
                    ? "🔄 Deploy Failed & Rolled Back: ${env.JOB_NAME} [${env.BUILD_NUMBER}]"
                    : "🚨 Jenkins Pipeline Failed: ${env.JOB_NAME} [${env.BUILD_NUMBER}]"
                    
                def payload = """
                {
                    "text": "${message}\\n<${env.BUILD_URL}|View Build>"
                }
                """
                sh "curl -X POST -H 'Content-type: application/json' --data '${payload}' \${SLACK_WEBHOOK_URL}"
            }
        }
    }
}
