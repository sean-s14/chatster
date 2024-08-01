pipeline {
    agent { label 'chatster-node' }

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: "${env.GIT_URL}",
                    branch: 'feature'
                )
            }
        }

        stage('Build and Start Containers') {
            steps {
                script {
                    bat 'docker-compose --version'
                    bat "docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d --build"
                    dir('./server') {
                        bat 'docker exec chatster-server npx prisma migrate dev --name init'
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    dir('./server') {
                        bat "docker exec chatster-server npm run test"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                bat "docker-compose down -v"
            }
        }
    }
}