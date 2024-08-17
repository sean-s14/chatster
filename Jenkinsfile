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

        stage('Build and Start Dev Containers') {
            steps {
                script {
                    bat 'docker-compose --version'
                    bat "docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build"
                    dir('./server') {
                        bat 'docker exec chatster-server npx prisma migrate deploy'
                    }
                }
            }
        }

        stage('Run Tests for Dev Containers') {
            steps {
                script {
                    dir('./server') {
                        bat "docker exec chatster-server npm run test"
                    }
                    dir('./client') {
                        bat 'docker exec chatster-client npm run test:run'
                        bat 'docker exec chatster-client npm run cy:run'
                    }
                }
            }
        }

        stage('Tear Down Dev Containers') {
            steps {
                script {
                    bat "docker-compose down -v"
                }
            }
        }

        stage('Build and Start Test Containers') {
            steps {
                script {
                    bat 'docker-compose --version'
                    bat "docker-compose -f docker-compose.yaml -f docker-compose.test.yaml up -d --build"
                    dir('./server') {
                        bat 'docker exec chatster-server npx prisma migrate deploy'
                    }
                }
            }
        }

        stage('Run Cypress Tests for Production Code') {
            steps {
                script {
                    dir('./client') {
                        bat 'docker exec chatster-client npm run cy:run'
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                bat "docker-compose down -v --remove-orphans"
            }
        }
    }
}